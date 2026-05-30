import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Device } from "../device/entities/device.entity";
import { User } from "../user/entities/user.entity";
import { CreateDeviceUsageDto } from "./dto/create-device-usage.dto";
import { UpdateDeviceUsageDto } from "./dto/update-device-usage.dto";
import { DeviceUsage } from "./entities/device-usage.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Household } from "../household/entities/household.entity";
import { TariffClass } from "../tariff-class/entities/tariff-class.entity";

@Injectable()
export class DeviceUsageService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(DeviceUsage)
    private readonly deviceUsageModel: typeof DeviceUsage,
    @InjectModel(Device) private deviceModel: typeof Device,
    @InjectModel(Household) private readonly householdModel: typeof Household,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async findAll(query: any, device: Device) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.deviceUsageModel,
        query
      )
        .where({ device_id: device.id })
        .getResult();

      const result = {
        count,
        device_usages: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get all device usages"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(deviceUsage: DeviceUsage) {
    try {
      return this.response.success(
        deviceUsage,
        200,
        "Successfully get device usage"
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  private async checkAndTriggerDssAlert(device: Device, usageHours: number, user: User) {
    try {
      // Pemicu DSS: Perangkat berdaya tinggi (>= 300W) dengan pemakaian > 8 jam
      if (device.wattage >= 300 && usageHours > 8) {
        // Dapatkan data household & tarif
        const household = await this.householdModel.findOne({
          where: { user_id: user.id },
          include: [TariffClass],
        });

        const price = Number((household as any)?.tariff_class?.price_per_kwh ?? 1444);
        
        // Hitung estimasi penghematan bulanan jika dipotong ke 6 jam/hari
        const savingKwh = (device.wattage * (usageHours - 6) / 1000) * 30;
        const savingRupiah = Math.round(savingKwh * price);

        const message = `Rekomendasi DSS: Perangkat "${device.name}" (${device.wattage} W) digunakan selama ${usageHours} jam hari ini. Menguranginya menjadi 6 jam/hari dapat menghemat sekitar Rp ${savingRupiah.toLocaleString('id-ID')}/bulan.`;

        this.eventEmitter.emit('notification', ['system'], {
          type: 'dss_recommendation',
          notified_user_id: user.id,
          message,
          data: { deviceId: device.id, action: 'view_device' }
        });
      }
    } catch (error) {
      console.error('Failed to trigger DSS recommendation', error);
    }
  }

  async create(
    createDeviceUsageDto: CreateDeviceUsageDto,
    device: Device,
    user: User
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (device.user_id !== user.id) {
        return this.response.fail("Device not found", 404);
      }

      const estimated_kwh =
        (device.wattage * createDeviceUsageDto.usage_hours) / 1000;

      const deviceUsage = await this.deviceUsageModel.create(
        {
          ...createDeviceUsageDto,
          device_id: device.id,
          estimated_kwh,
        },
        { transaction }
      );

      await transaction.commit();

      // Trigger DSS check asynchronous
      void this.checkAndTriggerDssAlert(device, createDeviceUsageDto.usage_hours, user);

      return this.response.success(
        deviceUsage,
        201,
        "Successfully created device usage"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message || error, 400);
    }
  }

  async update(
    deviceUsage: DeviceUsage,
    updateDeviceUsageDto: UpdateDeviceUsageDto,
    user: User
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const targetDeviceId =
        updateDeviceUsageDto.device_id ?? deviceUsage.device_id;
      const device = await this.deviceModel.findByPk(targetDeviceId);

      if (!device || device.user_id !== user.id) {
        return this.response.fail("Device not found", 404);
      }

      const usage_hours =
        updateDeviceUsageDto.usage_hours ?? deviceUsage.usage_hours;
      const estimated_kwh = (device.wattage * usage_hours) / 1000;

      await deviceUsage.update(
        {
          ...updateDeviceUsageDto,
          device_id: device.id,
          usage_hours,
          estimated_kwh,
        },
        { transaction }
      );
      await transaction.commit();

      // Trigger DSS check asynchronous
      void this.checkAndTriggerDssAlert(device, usage_hours, user);

      return this.response.success(
        deviceUsage,
        200,
        "Successfully updated device usage"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(deviceUsage: DeviceUsage) {
    const transaction = await this.sequelize.transaction();
    try {
      await deviceUsage.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        deviceUsage,
        200,
        "Successfully deleted device usage"
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
