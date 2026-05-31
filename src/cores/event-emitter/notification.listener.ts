import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Sequelize } from 'sequelize-typescript';
import { Notification } from 'src/features/notification/entities/notification.entity';
import { User } from 'src/features/user/entities/user.entity';
import { PushNotificationService } from 'src/features/notification/public/push-notification.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);
  sequelize: Sequelize;

  constructor(
    sequelize: Sequelize,
    private readonly pushNotificationService: PushNotificationService,
  ) {
    this.sequelize = sequelize;
  }

  @OnEvent('notification')
  async notification(options: Array<string>, data: any) {
    try {
      if (options.includes('system')) {
        await this.system(data);
      }
      return true;
    } catch (error) {
      console.log('error', error);
    }
  }

  private async system(data) {
    const user = await User.findOne({
      where: { id: data.notified_user_id },
    });
    if (user) {
      await Notification.create({
        type: data.type,
        data: JSON.stringify(data.data || {}),
        message: data.message || '',
        notified_user_id: data.notified_user_id,
      });

      // Kirim push notification ke semua device milik user
      try {
        await this.pushNotificationService.sendPushToUser(
          data.notified_user_id,
          {
            title: 'Smart Energy Monitoring',
            body: data.message || '',
            data: data.data || {},
          },
        );
      } catch (error) {
        this.logger.warn(
          `Failed to send push notification to User ID ${data.notified_user_id}`,
        );
      }
    }
  }
}

