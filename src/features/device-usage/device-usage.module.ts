import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Device } from "../device/entities/device.entity";
import { DeviceUsageController } from "./device-usage.controller";
import { DeviceUsageService } from "./device-usage.service";
import { DeviceUsage } from "./entities/device-usage.entity";
import { Household } from "../household/entities/household.entity";
import { TariffClass } from "../tariff-class/entities/tariff-class.entity";

@Module({
  imports: [SequelizeModule.forFeature([DeviceUsage, Device, Household, TariffClass])],
  controllers: [DeviceUsageController],
  providers: [DeviceUsageService],
})
export class DeviceUsageModule {}
