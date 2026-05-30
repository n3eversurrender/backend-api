import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateDeviceCategoryDto } from "./dto/create-device-category.dto";
import { UpdateDeviceCategoryDto } from "./dto/update-device-category.dto";
import { DeviceCategory } from "./entities/device-category.entity";

@Injectable()
export class DeviceCategoryService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(DeviceCategory)
    private readonly deviceCategoryModel: typeof DeviceCategory
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.deviceCategoryModel,
        query
      ).getResult();

      const result = {
        count: count,
        categories: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get all device categories"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(category: DeviceCategory) {
    try {
      return this.response.success(
        category,
        200,
        "Successfully get device category"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createDeviceCategoryDto: CreateDeviceCategoryDto, user: User) {
    if (![UserRoleEnum.ADMIN].includes(user.role)) {
      return this.response.fail(
        "You are not authorized to create a device category",
        403
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      const category = await this.deviceCategoryModel.create(
        { ...createDeviceCategoryDto },
        { transaction }
      );

      await transaction.commit();

      return this.response.success(
        category,
        201,
        "Successfully create device category"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    category: DeviceCategory,
    updateDeviceCategoryDto: UpdateDeviceCategoryDto,
    user: User
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await category.update(updateDeviceCategoryDto, { transaction });
      await transaction.commit();

      return this.response.success(
        category,
        200,
        "Successfully update device category"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(category: DeviceCategory) {
    const transaction = await this.sequelize.transaction();
    try {
      await category.destroy({ transaction });

      await transaction.commit();

      return this.response.success(
        category,
        200,
        "Successfully delete device category"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
