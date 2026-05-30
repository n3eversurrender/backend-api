import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { User } from "../user/entities/user.entity";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";
import { Device } from "./entities/device.entity";

@Injectable()
export class DeviceService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Device)
    private readonly deviceModel: typeof Device
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.deviceModel,
        query
      ).getResult();

      const result = {
        count,
        devices: data,
      };

      return this.response.success(result, 200, "Successfully get all devices");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(device: Device) {
    try {
      return this.response.success(device, 200, "Successfully get device");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createDeviceDto: CreateDeviceDto, user: User) {
    const transaction = await this.sequelize.transaction();
    try {
      const device = await this.deviceModel.create(
        { ...createDeviceDto, user_id: user.id },
        { transaction }
      );

      await transaction.commit();

      return this.response.success(device, 201, "Successfully created device");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(device: Device, updateDeviceDto: UpdateDeviceDto, user: User) {
    const transaction = await this.sequelize.transaction();
    try {
      await device.update(updateDeviceDto, { transaction });
      await transaction.commit();

      return this.response.success(device, 200, "Successfully updated device");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(device: Device) {
    const transaction = await this.sequelize.transaction();
    try {
      await device.destroy({ transaction });
      await transaction.commit();

      return this.response.success(device, 200, "Successfully deleted device");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
