import { Injectable } from "@nestjs/common";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { S3Helper } from "./s3.helper";

export interface DimensionDetail {
  width: number;
  fit: "contain" | "inside";
  prefix: string;
}

export interface ResizeOption extends FileDimension {
  // Set file folder path
  path: string;
}

export interface FileDimension {
  // set image dimension
  dimensions: Array<DimensionDetail>;
}

@Injectable()
export class SharpHelper {
  public async resizeAndUpload(
    file: Express.Multer.File,
    option: ResizeOption,
  ): Promise<{ file_path: string; url: string }> {
    const info = await fileTypeFromBuffer(new Uint8Array(file.buffer));
    if (!info) {
      throw new Error("File type not supported");
    }

    const s3Helper = new S3Helper();
    let fileUrl: URL;
    if (info.mime.includes("image")) {
      const currentDate = new Date();
      const dateStr = currentDate.toISOString();
      const md5Hash = new Bun.CryptoHasher("md5").update(dateStr).digest("hex");
      let fileBuffer = file.buffer;
      if (info.mime.includes("heic") || info.mime.includes("heif")) {
        const convertHeic = require("heic-convert");
        fileBuffer = await convertHeic({
          buffer: file.buffer, // the HEIC file buffer
          format: "PNG", // output format
          quality: 1, // the jpeg compression quality, between 0 and 1
        });
      }

      for (const dimension of option.dimensions) {
        sharp(fileBuffer)
          .webp({ quality: 95, smartSubsample: true })
          .resize({
            ...dimension,
            fit: dimension.fit,
            background: { r: 255, g: 255, b: 255 },
          })
          .toBuffer()
          .then(async (buffer) => {
            const fileName = md5Hash + "-" + dimension.prefix;
            await s3Helper.uploadFile(
              buffer,
              option.path,
              "public-read",
              fileName,
            );
          });
      }

      const originalBuffer = await sharp(fileBuffer).webp().toBuffer();

      // save original file
      const originalFile = await s3Helper.uploadFile(
        originalBuffer,
        option.path,
        "public-read",
        md5Hash,
      );

      fileUrl = new URL(originalFile.Location);
    } else {
      const documentFile = await s3Helper.uploadFile(
        file.buffer,
        option.path,
        "public-read",
      );
      fileUrl = new URL(documentFile.Location);
    }

    return { file_path: fileUrl.pathname.substring(1), url: fileUrl.href };
  }

  public async delete(originalFile: string, option: FileDimension) {
    const splitOriginalFile = originalFile.split(".");
    const originalName = splitOriginalFile[0];
    const extension = splitOriginalFile[1];

    const s3Helper = new S3Helper();

    // delete all resized file
    for (const dimension of option.dimensions) {
      const fileName = originalName + "-" + dimension.prefix + "." + extension;
      await s3Helper.deleteFile(fileName);
    }

    // delete original file
    await s3Helper.deleteFile(originalFile);

    return true;
  }
}
