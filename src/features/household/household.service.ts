import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateHouseholdDto } from "./dto/create-household.dto";
import { UpdateHouseholdDto } from "./dto/update-household.dto";
import { Household } from "./entities/household.entity";

@Injectable()
export class HouseholdService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Household)
    private readonly householdModel: typeof Household
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.householdModel,
        query
      )
        .load("tariff_class")
        .getResult();

      const result = {
        count,
        households: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get all households"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(household: Household) {
    try {
      return this.response.success(
        household,
        200,
        "Successfully get household"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createHouseholdDto: CreateHouseholdDto, user: User) {
    const transaction = await this.sequelize.transaction();
    try {
      const household = await this.householdModel.create(
        {
          ...createHouseholdDto,
          user_id: user.id,
        },
        { transaction }
      );

      await transaction.commit();

      return this.response.success(
        household,
        201,
        "Successfully created household"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    household: Household,
    updateHouseholdDto: UpdateHouseholdDto,
    user: User
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (
        ![UserRoleEnum.ADMIN].includes(user.role) &&
        household.user_id !== user.id
      ) {
        return this.response.fail(
          "You are not allowed to update this household",
          403
        );
      }

      await household.update(updateHouseholdDto, { transaction });
      await transaction.commit();

      return this.response.success(
        household,
        200,
        "Successfully updated household"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(household: Household) {
    const transaction = await this.sequelize.transaction();
    try {
      await household.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        household,
        200,
        "Successfully deleted household"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
