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
import { DeviceCategory } from "src/features/device-category/entities/device-category.entity";
import { Household } from "src/features/household/entities/household.entity";
import { User } from "src/features/user/entities/user.entity";

@Table({
  tableName: "devices",
  modelName: "devices",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  timestamps: true,
  paranoid: true,
})
export class Device extends Model {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  wattage: number;

  @ForeignKey(() => DeviceCategory)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => DeviceCategory, "category_id")
  category: TypeWrapper<DeviceCategory>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, "user_id")
  user: TypeWrapper<User>;

  @ForeignKey(() => Household)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  household_id: number;

  @BelongsTo(() => Household, "household_id")
  household: TypeWrapper<Household>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;
}
