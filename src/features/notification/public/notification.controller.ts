import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { NotificationCronService } from './notification-cron.service';
import { PushNotificationService } from './push-notification.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationCronService: NotificationCronService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query, @CurrentUser() user) {
    return this.notificationService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trigger-cron/:type')
  async triggerCron(@Param('type') type: string) {
    if (type === 'daily') {
      await this.notificationCronService.handleDailyReminder();
      return { message: 'Daily reminder cron triggered successfully' };
    } else if (type === 'monthly') {
      await this.notificationCronService.handleMonthlyReportReminder();
      return { message: 'Monthly reminder cron triggered successfully' };
    }
    return { error: 'Invalid cron type' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('mark-all-as-read')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/mark-as-read')
  markOneAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.markOneAsRead(id, user);
  }

  // ===== Push Notification Endpoints =====

  /**
   * GET /notifications/push/vapid-public-key
   * Dapatkan VAPID public key untuk subscribe push di frontend
   */
  @Get('push/vapid-public-key')
  getVapidPublicKey() {
    return {
      statusCode: 200,
      data: { publicKey: this.pushNotificationService.getPublicKey() },
    };
  }

  /**
   * POST /notifications/push/subscribe
   * Subscribe push notification dari browser user
   */
  @UseGuards(JwtAuthGuard)
  @Post('push/subscribe')
  async subscribePush(
    @CurrentUser() user: any,
    @Body() body: { endpoint: string; keys: { p256dh: string; auth: string } },
  ) {
    const device = await this.pushNotificationService.subscribe(user.id, body);
    return {
      statusCode: 200,
      message: 'Push notification subscribed successfully',
      data: { deviceId: device.id },
    };
  }

  /**
   * DELETE /notifications/push/unsubscribe
   * Unsubscribe push notification
   */
  @UseGuards(JwtAuthGuard)
  @Delete('push/unsubscribe')
  async unsubscribePush(
    @CurrentUser() user: any,
    @Body() body: { endpoint: string },
  ) {
    await this.pushNotificationService.unsubscribe(user.id, body.endpoint);
    return {
      statusCode: 200,
      message: 'Push notification unsubscribed successfully',
    };
  }
}

