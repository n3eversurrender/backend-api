import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { S3Helper } from "src/cores/helpers/s3.helper";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.userModel,
        query,
      ).getResult();

      const result = {
        count: count,
        users: data,
      };
      return this.response.success(result, 200, "Successfully get users");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(user: User) {
    return this.response.success(user, 200, "Successfully get user");
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await user.update(updateUserDto, { transaction });
      await transaction.commit();
      return this.response.success({ user }, 200, "Successfully updated user");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async updatePhotoProfile(user: User, file: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (user.file_path) {
        await s3Helper.deleteFile(user.file_path);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          "users/profile-photo",
          "public-read",
        );

        const imageUrl = new URL(uploadResult.Location);

        await user.update(
          { file_path: imageUrl.pathname.substring(1), url: imageUrl.href },
          { transaction },
        );
      } else {
        await user.update(
          {
            file_path: null,
            url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        user,
        200,
        "Successfully update photo profile",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await user.reload({ attributes: { include: ["password"] } });

      const isValid = await Bun.password.verify(
        changePasswordDto.old_password,
        user.password.replace(/\$2y\$|\$2a\$/, "$2b$"),
      );

      if (!isValid) {
        return this.response.fail("Invalid old password", 400);
      }

      changePasswordDto.new_password = await Bun.password.hash(
        changePasswordDto.new_password,
        {
          algorithm: "bcrypt",
          cost: 10,
        },
      );

      await user.update(
        { password: changePasswordDto.new_password },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(user, 200, "Successfully change password");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(user: User) {
    await user.destroy();
    return this.response.success({}, 200, "Successfully delete user");
  }
}
