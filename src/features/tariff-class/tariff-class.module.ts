import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TariffClass } from "./entities/tariff-class.entity";
import { TariffClassesController } from "./tariff-class.controller";
import { TariffClassesService } from "./tariff-class.service";

@Module({
  controllers: [TariffClassesController],
  providers: [TariffClassesService],
  imports: [SequelizeModule.forFeature([TariffClass])],
})
export class TariffClassesModule {}
