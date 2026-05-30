import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { NotificationCronService } from './notification-cron.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationCronService: NotificationCronService,
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
}
