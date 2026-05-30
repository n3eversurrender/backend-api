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
import { CreateHouseholdDto } from "./dto/create-household.dto";
import { UpdateHouseholdDto } from "./dto/update-household.dto";
import { Household } from "./entities/household.entity";
import { HouseholdService } from "./household.service";
import { householdIdParamSchema } from "./validations/params/household-id.param";
import { createHouseholdSchema } from "./validations/requests/create-household.request";
import { updateHouseholdSchema } from "./validations/requests/update-household.request";

@Controller()
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @CurrentUser() user: User) {
    if (user.role === 0) {
      query.user_id = user.id;
    }
    return this.householdService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(householdIdParamSchema))
    household: Household
  ) {
    return this.householdService.findOne(household);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createHouseholdSchema))
    createHouseholdDto: CreateHouseholdDto
  ) {
    return this.householdService.create(createHouseholdDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(householdIdParamSchema))
    household: Household,
    @Body(new JoiValidationPipe(updateHouseholdSchema))
    updateHouseholdDto: UpdateHouseholdDto,
    @CurrentUser() user: User
  ) {
    return this.householdService.update(household, updateHouseholdDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(householdIdParamSchema))
    household: Household
  ) {
    return this.householdService.remove(household);
  }
}
