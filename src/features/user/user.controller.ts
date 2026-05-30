import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { userIdParamSchema } from "../auth/validations/params/user-id.param";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { updateUserSchema } from "./validations/requests/update-user.request";
import { FileInterceptor } from "@nestjs/platform-express";
import { changePasswordSchema } from "./validations/requests/change-password.request";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(userIdParamSchema))
    user: User,
  ) {
    return this.userService.findOne(user);
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  @Post(":id/image")
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param("id", new JoiValidationParamPipe(userIdParamSchema)) user: User,
  ) {
    return this.userService.updatePhotoProfile(user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Put("change-password")
  async changePassword(
    @Body(new JoiValidationPipe(changePasswordSchema))
    changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.changePassword(user, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(
    @Body(new JoiValidationParamPipe(updateUserSchema))
    updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.update(user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(userIdParamSchema))
    user: User,
  ) {
    return this.userService.remove(user);
  }
}
