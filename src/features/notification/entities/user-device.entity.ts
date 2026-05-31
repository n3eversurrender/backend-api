import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/features/user/entities/user.entity';

@Table({
  tableName: 'user_devices',
  timestamps: true,
  modelName: 'user_devices',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserDevice extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    unique: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  endpoint: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  p256dh: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  auth: string;

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
