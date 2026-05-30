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
import { DeviceService } from "./device.service";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";
import { Device } from "./entities/device.entity";
import { deviceIdParamSchema } from "./validations/params/device-id.param";
import { createDeviceSchema } from "./validations/requests/create-device.request";
import { updateDeviceSchema } from "./validations/requests/update-device.request";

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @CurrentUser() user: User) {
    if (user.role === 0) {
      query.user_id = user.id;
    }
    return this.deviceService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(deviceIdParamSchema))
    device: Device
  ) {
    return this.deviceService.findOne(device);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createDeviceSchema))
    createDeviceDto: CreateDeviceDto
  ) {
    return this.deviceService.create(createDeviceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(deviceIdParamSchema))
    device: Device,
    @Body(new JoiValidationPipe(updateDeviceSchema))
    updateDeviceDto: UpdateDeviceDto,
    @CurrentUser() user: User
  ) {
    return this.deviceService.update(device, updateDeviceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(deviceIdParamSchema))
    device: Device
  ) {
    return this.deviceService.remove(device);
  }
}
