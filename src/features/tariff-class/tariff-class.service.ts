import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateTariffClassDto } from "./dto/create-tariff-class.dto";
import { UpdateTariffClassDto } from "./dto/update-tariff-class.dto";
import { TariffClass } from "./entities/tariff-class.entity";

@Injectable()
export class TariffClassesService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(TariffClass)
    private readonly tariffClassModel: typeof TariffClass
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.tariffClassModel,
        query
      ).getResult();

      const result = {
        count,
        tariff_classes: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get all tariff classes"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(tariffClass: TariffClass) {
    try {
      return this.response.success(
        tariffClass,
        200,
        "Successfully get tariff class"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createTariffClassDto: CreateTariffClassDto, user: User) {
    if (![UserRoleEnum.ADMIN].includes(user.role)) {
      return this.response.fail(
        "You are not authorized to create a tariff class",
        403
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      const tariffClass = await this.tariffClassModel.create(
        { ...createTariffClassDto, created_by: user.id },
        { transaction }
      );

      await transaction.commit();

      return this.response.success(
        tariffClass,
        201,
        "Successfully created tariff class"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    tariffClass: TariffClass,
    updateTariffClassDto: UpdateTariffClassDto,
    user: User
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await tariffClass.update(updateTariffClassDto, { transaction });
      await transaction.commit();

      return this.response.success(
        tariffClass,
        200,
        "Successfully updated tariff class"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(tariffClass: TariffClass) {
    const transaction = await this.sequelize.transaction();
    try {
      await tariffClass.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        tariffClass,
        200,
        "Successfully deleted tariff class"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
