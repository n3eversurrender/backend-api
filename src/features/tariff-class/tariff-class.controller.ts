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
import { CreateTariffClassDto } from "./dto/create-tariff-class.dto";
import { UpdateTariffClassDto } from "./dto/update-tariff-class.dto";
import { TariffClass } from "./entities/tariff-class.entity";
import { TariffClassesService } from "./tariff-class.service";
import { tariffClassIdParamSchema } from "./validations/params/tarif-class-id.param";
import { createTariffClassSchema } from "./validations/requests/create-tariff-class.request";
import { updateTariffClassSchema } from "./validations/requests/update-tariff-class.request";

@Controller()
export class TariffClassesController {
  constructor(private readonly tariffClassesService: TariffClassesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any) {
    return this.tariffClassesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(tariffClassIdParamSchema))
    tariffClass: TariffClass
  ) {
    return this.tariffClassesService.findOne(tariffClass);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createTariffClassSchema))
    createTariffClassDto: CreateTariffClassDto
  ) {
    return this.tariffClassesService.create(createTariffClassDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(tariffClassIdParamSchema))
    tariffClass: TariffClass,
    @Body(new JoiValidationPipe(updateTariffClassSchema))
    updateTariffClassDto: UpdateTariffClassDto,
    @CurrentUser() user: User
  ) {
    return this.tariffClassesService.update(
      tariffClass,
      updateTariffClassDto,
      user
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(tariffClassIdParamSchema))
    tariffClass: TariffClass
  ) {
    return this.tariffClassesService.remove(tariffClass);
  }
}
