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
}
