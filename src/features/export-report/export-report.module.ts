import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeviceUsage } from "../device-usage/entities/device-usage.entity";
import { Device } from "../device/entities/device.entity";
import { Household } from "../household/entities/household.entity";
import { TariffClass } from "../tariff-class/entities/tariff-class.entity";
import { ExportReportController } from "./export-report.controller";
import { ExportReportService } from "./export-report.service";

@Module({
  imports: [
    SequelizeModule.forFeature([DeviceUsage, Device, Household, TariffClass]),
  ],
  controllers: [ExportReportController],
  providers: [ExportReportService],
})
export class ExportReportModule {}
