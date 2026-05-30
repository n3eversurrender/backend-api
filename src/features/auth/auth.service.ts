import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateUserDto } from "src/features/auth/dto/create-user.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const result = {
      user,
      access_token: this.jwtService.sign(payload),
    };
    return this.response.success(result, 200);
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        where: { [Op.or]: { email: username, username: username } },
        attributes: { include: ["password"] },
      });

      if (user) {
        const isValid = await Bun.password.verify(
          password,
          user.password.replace(/\$2y\$|\$2a\$/, "$2b$"),
        );

        if (isValid) {
          const result = user.toJSON();
          delete result.password;
          return result;
        }
      }

      return false;
    } catch (error) {
      console.log(error);
      return this.response.fail(error, HttpStatus.BAD_REQUEST);
    }
  }

  async validateJwt(id: number) {
    const user = await this.userModel.findByPk(id);
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      createUserDto.password = await Bun.password.hash(createUserDto.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const user = await this.userModel
        .create({ ...createUserDto })
        .then((value) => value.toJSON());

      delete user.password;
      await transaction.commit();
      return this.response.success(
        user,
        HttpStatus.OK,
        "Successfully register user",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  profile(user: User) {
    return this.response.success(
      user,
      HttpStatus.OK,
      "Successfully get profile",
    );
  }

  async verifyForgotPassword(username: string, email: string) {
    try {
      const user = await this.userModel.findOne({
        where: { username, email },
      });

      if (!user) {
        return this.response.fail("Username and email combination not found.", HttpStatus.NOT_FOUND);
      }

      return this.response.success({ verified: true }, HttpStatus.OK, "User verified successfully");
    } catch (error: any) {
      return this.response.fail(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(username: string, email: string, newPassword: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.userModel.findOne({
        where: { username, email },
      });

      if (!user) {
        return this.response.fail("User not found.", HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await Bun.password.hash(newPassword, {
        algorithm: "bcrypt",
        cost: 10,
      });

      await user.update({ password: hashedPassword }, { transaction });
      await transaction.commit();

      return this.response.success(null, HttpStatus.OK, "Password reset successfully!");
    } catch (error: any) {
      await transaction.rollback();
      return this.response.fail(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
