import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { Device } from "./entities/device.entity";

@Module({
  imports: [SequelizeModule.forFeature([Device])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
