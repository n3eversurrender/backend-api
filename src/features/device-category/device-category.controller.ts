import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { User } from "../user/entities/user.entity";
import { DeviceCategoryService } from "./device-category.service";
import { CreateDeviceCategoryDto } from "./dto/create-device-category.dto";
import { UpdateDeviceCategoryDto } from "./dto/update-device-category.dto";
import { DeviceCategory } from "./entities/device-category.entity";
import { deviceCategoryIdParamSchema } from "./validations/params/device-category-id.param";
import { createDeviceCategorySchema } from "./validations/requests/create-device-category.request";
import { updateDeviceCategorySchema } from "./validations/requests/update-device-category.request";

@Controller()
export class DeviceCategoryController {
  constructor(private readonly deviceCategoryService: DeviceCategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any) {
    return this.deviceCategoryService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(deviceCategoryIdParamSchema))
    category: DeviceCategory
  ) {
    return this.deviceCategoryService.findOne(category);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createDeviceCategorySchema))
    createDeviceCategoryDto: CreateDeviceCategoryDto
  ) {
    return this.deviceCategoryService.create(createDeviceCategoryDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(deviceCategoryIdParamSchema))
    category: DeviceCategory,
    @Body(new JoiValidationPipe(updateDeviceCategorySchema))
    updateDeviceCategoryDto: UpdateDeviceCategoryDto,
    @CurrentUser() user: User
  ) {
    return this.deviceCategoryService.update(
      category,
      updateDeviceCategoryDto,
      user
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(deviceCategoryIdParamSchema))
    category: DeviceCategory
  ) {
    return this.deviceCategoryService.remove(category);
  }
}
