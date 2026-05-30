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
import { TariffClass } from "src/features/tariff-class/entities/tariff-class.entity";
import { User } from "src/features/user/entities/user.entity";

@Table({
  tableName: "households",
  modelName: "households",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  timestamps: true,
  paranoid: true,
})
export class Household extends Model {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, "user_id")
  user: TypeWrapper<User>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @ForeignKey(() => TariffClass)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  tariff_class_id: number;

  @BelongsTo(() => TariffClass, "tariff_class_id")
  tariff_class: TypeWrapper<TariffClass>;
}
