import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from '../entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationCronService } from './notification-cron.service';
import { User } from 'src/features/user/entities/user.entity';
import { Device } from 'src/features/device/entities/device.entity';
import { DeviceUsage } from 'src/features/device-usage/entities/device-usage.entity';
import { Household } from 'src/features/household/entities/household.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Notification,
      User,
      Device,
      DeviceUsage,
      Household,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationCronService],
})
export class NotificationModule {}
