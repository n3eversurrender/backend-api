import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Household } from "./entities/household.entity";
import { HouseholdController } from "./household.controller";
import { HouseholdService } from "./household.service";

@Module({
  imports: [SequelizeModule.forFeature([Household])],
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {}
