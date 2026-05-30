import { Injectable, Logger } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { fileTypeFromBuffer } from "file-type";
import moment from "moment";

@Injectable()
export class S3Helper {
  protected s3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  async uploadFile(
    file: Express.Multer.File | Buffer,
    fileName: string,
    acl: string,
    customName = null,
  ) {
    const date = moment().format("YYYYMMDD");

    let params: { Bucket: string; Key: string; Body: any; ACL: string };
    let extension;

    const randomName = new Bun.CryptoHasher("md5")
      .update(String(Math.random()))
      .digest("hex")
      .substring(0, 8);

    // set file name
    fileName = fileName + "-" + date + "-" + randomName;

    if (Buffer.isBuffer(file)) {
      const info = await fileTypeFromBuffer(new Uint8Array(file));

      params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName + "." + info.ext,
        Body: file,
        ACL: acl,
      };

      extension = info.ext;
    } else {
      const info = await fileTypeFromBuffer(new Uint8Array(file.buffer));
      params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName + "." + info.ext,
        Body: file.buffer,
        ACL: acl,
      };

      extension = info.ext;
    }

    if (customName !== null) {
      params.Key = customName + "." + extension;
    }

    return this.s3
      .upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          throw new Error(err.message);
        }
        return data;
      })
      .promise()
      .then((data) => data);
  }

  async deleteFile(filePath: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filePath,
    };

    return this.s3
      .deleteObject(params, (err, data) => {
        if (err) {
          Logger.error(err);
          throw new Error(err.message);
        }
        return data;
      })
      .promise()
      .then((data) => data);
  }
}
