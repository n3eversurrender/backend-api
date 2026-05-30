import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { User } from 'src/features/user/entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { Op } from 'sequelize';

@Injectable()
export class NotificationService {
  constructor(
    private response: ResponseHelper,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async findAll(query: any, user: User) {
    const condition: any = { notified_user_id: user.id };

    if (query.read_at === 'null') {
      condition.read_at = null;
      delete query.read_at;
    } else if (query.read_at === 'not_null') {
      condition.read_at = { [Op.ne]: null };
      delete query.read_at;
    }

    const { count, data } = await new QueryBuilderHelper(
      this.notificationModel,
      query,
    )
      .where(condition)
      .getResult();

    const result = {
      count: count,
      notifications: data,
    };

    return this.response.success(
      result,
      200,
      'Successfully retrieve notification',
    );
  }

  async markAllAsRead(user: User) {
    try {
      await this.notificationModel.update(
        { read_at: new Date() },
        {
          where: {
            notified_user_id: user.id,
          },
        },
      );

      return this.response.success(
        [],
        200,
        'Successfully marked all notifications as read',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async markOneAsRead(id, user: User) {
    try {
      const notification = await this.notificationModel.findOne({
        where: {
          id: id,
          notified_user_id: user.id,
        },
      });

      await notification.update({ read_at: new Date() });

      return this.response.success(
        [],
        200,
        'Successfully marked notifications as read',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }
}
