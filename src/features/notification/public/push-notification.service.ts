import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as webpush from 'web-push';
import { UserDevice } from '../entities/user-device.entity';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UserDevice)
    private readonly userDeviceModel: typeof UserDevice,
  ) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>('VAPID_SUBJECT');

    if (publicKey && privateKey && subject) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.logger.log('VAPID details configured successfully');
    } else {
      this.logger.warn(
        'VAPID keys not found in environment variables. Push notifications will not work.',
      );
    }
  }

  /**
   * Subscribe: simpan push subscription dari browser user
   */
  async subscribe(
    userId: number,
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  ) {
    // Cek apakah subscription dengan endpoint yang sama sudah ada
    const existing = await this.userDeviceModel.findOne({
      where: {
        user_id: userId,
        endpoint: subscription.endpoint,
      },
    });

    if (existing) {
      // Update keys jika sudah ada
      await existing.update({
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      });
      this.logger.log(`Updated push subscription for User ID ${userId}`);
      return existing;
    }

    // Buat subscription baru
    const device = await this.userDeviceModel.create({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });

    this.logger.log(`Created push subscription for User ID ${userId}`);
    return device;
  }

  /**
   * Unsubscribe: hapus push subscription
   */
  async unsubscribe(userId: number, endpoint: string) {
    const deleted = await this.userDeviceModel.destroy({
      where: {
        user_id: userId,
        endpoint: endpoint,
      },
    });

    this.logger.log(
      `Deleted ${deleted} push subscription(s) for User ID ${userId}`,
    );
    return deleted;
  }

  /**
   * Kirim push notification ke semua device milik user
   */
  async sendPushToUser(
    userId: number,
    payload: { title: string; body: string; data?: any },
  ) {
    const devices = await this.userDeviceModel.findAll({
      where: { user_id: userId },
    });

    if (devices.length === 0) {
      return;
    }

    const payloadStr = JSON.stringify(payload);

    const results = await Promise.allSettled(
      devices.map(async (device) => {
        const subscription = {
          endpoint: device.endpoint,
          keys: {
            p256dh: device.p256dh,
            auth: device.auth,
          },
        };

        try {
          await webpush.sendNotification(subscription, payloadStr);
          this.logger.log(
            `Push sent to User ID ${userId}, device ${device.id}`,
          );
        } catch (error: any) {
          // Jika subscription expired atau invalid (410 Gone, 404 Not Found)
          if (error.statusCode === 410 || error.statusCode === 404) {
            this.logger.warn(
              `Subscription expired for User ID ${userId}, device ${device.id}. Removing...`,
            );
            await device.destroy();
          } else {
            this.logger.error(
              `Failed to send push to User ID ${userId}, device ${device.id}: ${error.message}`,
            );
          }
          throw error;
        }
      }),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(
      `Push notifications for User ID ${userId}: ${successful} sent, ${failed} failed`,
    );
  }

  /**
   * Get VAPID public key untuk dikirim ke frontend
   */
  getPublicKey(): string {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') || '';
  }
}
