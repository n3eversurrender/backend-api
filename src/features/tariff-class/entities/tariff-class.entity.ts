import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "tariff_classes",
  modelName: "tariff_classes",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  timestamps: true,
  paranoid: true,
})
export class TariffClass extends Model {
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
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  voltage: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  capacity_va: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_per_kwh: number;
}
