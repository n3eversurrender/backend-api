import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { User } from 'src/features/user/entities/user.entity';
import { Device } from 'src/features/device/entities/device.entity';
import { DeviceUsage } from 'src/features/device-usage/entities/device-usage.entity';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationCronService {
  private readonly logger = new Logger(NotificationCronService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Device) private readonly deviceModel: typeof Device,
    @InjectModel(DeviceUsage) private readonly deviceUsageModel: typeof DeviceUsage,
    @InjectModel(Notification) private readonly notificationModel: typeof Notification,
  ) {}

  // 1. Daily Reminder: Setiap hari pukul 20:00 (8 Malam)
  @Cron('0 20 * * *')
  async handleDailyReminder() {
    this.logger.log('Running Daily Reminder Cron Job...');
    try {
      // Dapatkan tanggal hari ini dalam format lokal YYYY-MM-DD
      const d = new Date();
      const tzOffset = d.getTimezoneOffset() * 60000;
      const todayStr = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];

      // Dapatkan semua user biasa (role !== 1 atau yang bukan admin)
      const users = await this.userModel.findAll({
        where: {
          role: { [Op.ne]: 1 },
        },
      });

      for (const user of users) {
        // Cek apakah user memiliki minimal 1 device aktif
        const activeDevicesCount = await this.deviceModel.count({
          where: {
            user_id: user.id,
            is_active: true,
          },
        });

        if (activeDevicesCount === 0) {
          continue;
        }

        // Cek apakah ada DeviceUsage untuk device user hari ini
        const loggedToday = await this.deviceUsageModel.count({
          include: [
            {
              model: Device,
              required: true,
              where: { user_id: user.id },
            },
          ],
          where: {
            usage_date: todayStr,
          },
        });

        // Jika belum mengisi pemakaian hari ini
        if (loggedToday === 0) {
          // Pastikan belum dikirimi notifikasi serupa hari ini
          const alreadyNotified = await this.notificationModel.count({
            where: {
              notified_user_id: user.id,
              type: 'daily_reminder',
              created_at: {
                [Op.gte]: new Date(todayStr + 'T00:00:00.000Z'),
              },
            },
          });

          if (alreadyNotified === 0) {
            this.eventEmitter.emit('notification', ['system'], {
              type: 'daily_reminder',
              notified_user_id: user.id,
              message: 'Jangan lupa untuk mencatat pemakaian listrik perangkat Anda hari ini untuk melengkapi analisis DSS!',
              data: { action: 'log_usage' },
            });
            this.logger.log(`Sent daily reminder to User ID ${user.id}`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error executing Daily Reminder Cron Job', error);
    }
  }

  // 2. Monthly Reminder: Setiap tanggal 1 pukul 08:00 Pagi
  @Cron('0 8 1 * *')
  async handleMonthlyReportReminder() {
    this.logger.log('Running Monthly Report Reminder Cron Job...');
    try {
      const d = new Date();
      // Set ke bulan lalu
      d.setMonth(d.getMonth() - 1);
      const lastMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      const monthNamesIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const lastMonthName = monthNamesIndo[d.getMonth()];

      const users = await this.userModel.findAll({
        where: {
          role: { [Op.ne]: 1 },
        },
      });

      for (const user of users) {
        // Cek apakah ada pemakaian bulan lalu
        const usageCount = await this.deviceUsageModel.count({
          include: [
            {
              model: Device,
              required: true,
              where: { user_id: user.id },
            },
          ],
          where: {
            usage_date: {
              [Op.like]: `${lastMonthStr}-%`,
            },
          },
        });

        if (usageCount > 0) {
          // Cek apakah sudah pernah dikirimi notifikasi bulan ini
          const currentMonthStr = new Date().toISOString().split('T')[0].slice(0, 7);
          const alreadyNotified = await this.notificationModel.count({
            where: {
              notified_user_id: user.id,
              type: 'monthly_reminder',
              created_at: {
                [Op.gte]: new Date(currentMonthStr + '-01T00:00:00.000Z'),
              },
            },
          });

          if (alreadyNotified === 0) {
            this.eventEmitter.emit('notification', ['system'], {
              type: 'monthly_reminder',
              notified_user_id: user.id,
              message: `Laporan pemakaian listrik Anda untuk bulan ${lastMonthName} sudah siap. Silakan unduh laporan bulanan Anda!`,
              data: { action: 'download_report', period: lastMonthStr },
            });
            this.logger.log(`Sent monthly report reminder to User ID ${user.id}`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error executing Monthly Report Reminder Cron Job', error);
    }
  }
}
