import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "src/features/user/entities/user.entity";

@Table({
  tableName: "notifications",
  timestamps: true,
  modelName: "notifications",
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class Notification extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  notified_user_id: number;

  @BelongsTo(() => User, "notified_user_id")
  notified_user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  data: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: " ",
  })
  message: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  read_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;
}
