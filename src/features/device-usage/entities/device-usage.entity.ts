import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Device } from "src/features/device/entities/device.entity";

@Table({
  tableName: "device_usages",
  modelName: "device_usages",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  timestamps: true,
  paranoid: true,
})
export class DeviceUsage extends Model {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Device)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  device_id: number;

  @BelongsTo(() => Device, "device_id")
  device: TypeWrapper<Device>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  usage_date: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  usage_hours: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  estimated_kwh: number;
}
