import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeviceCategoryController } from "./device-category.controller";
import { DeviceCategoryService } from "./device-category.service";
import { DeviceCategory } from "./entities/device-category.entity";

@Module({
  imports: [SequelizeModule.forFeature([DeviceCategory])],
  controllers: [DeviceCategoryController],
  providers: [DeviceCategoryService],
})
export class DeviceCategoryModule {}
