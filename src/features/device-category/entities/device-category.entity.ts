import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "device_categories",
  modelName: "device_categories",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  timestamps: true,
  paranoid: true,
})
export class DeviceCategory extends Model {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
}
