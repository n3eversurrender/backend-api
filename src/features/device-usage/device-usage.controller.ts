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
import { Device } from "../device/entities/device.entity";
import { deviceIdParamSchema } from "../device/validations/params/device-id.param";
import { User } from "../user/entities/user.entity";
import { DeviceUsageService } from "./device-usage.service";
import { CreateDeviceUsageDto } from "./dto/create-device-usage.dto";
import { UpdateDeviceUsageDto } from "./dto/update-device-usage.dto";
import { DeviceUsage } from "./entities/device-usage.entity";
import { deviceUsageIdParamSchema } from "./validations/params/device-usage-id.param";
import { createDeviceUsageSchema } from "./validations/requests/create-device-usage.request";
import { updateDeviceUsageSchema } from "./validations/requests/update-device-usage.request";

@Controller()
export class DeviceUsageController {
  constructor(private readonly deviceUsageService: DeviceUsageService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() query: any,
    @Param("deviceId", new JoiValidationParamPipe(deviceIdParamSchema))
    device: Device
  ) {
    return this.deviceUsageService.findAll(query, device);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param(new JoiValidationParamPipe(deviceUsageIdParamSchema))
    deviceUsage: DeviceUsage
  ) {
    return this.deviceUsageService.findOne(deviceUsage);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createDeviceUsageSchema))
    createDeviceUsageDto: CreateDeviceUsageDto,
    @Param("deviceId", new JoiValidationParamPipe(deviceIdParamSchema))
    device: Device
  ) {
    return this.deviceUsageService.create(createDeviceUsageDto, device, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param(new JoiValidationParamPipe(deviceUsageIdParamSchema))
    deviceUsage: DeviceUsage,
    @Body(new JoiValidationPipe(updateDeviceUsageSchema))
    updateDeviceUsageDto: UpdateDeviceUsageDto,
    @CurrentUser() user: User
  ) {
    return this.deviceUsageService.update(
      deviceUsage,
      updateDeviceUsageDto,
      user
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param(new JoiValidationParamPipe(deviceUsageIdParamSchema))
    deviceUsage: DeviceUsage
  ) {
    return this.deviceUsageService.remove(deviceUsage);
  }
}
