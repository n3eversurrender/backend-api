import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Sequelize } from 'sequelize-typescript';
import { Notification } from 'src/features/notification/entities/notification.entity';
import { User } from "src/features/user/entities/user.entity";

@Injectable()
export class NotificationListener {
  sequelize: Sequelize;
  constructor(sequelize: Sequelize) {
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
    }
  }
}
