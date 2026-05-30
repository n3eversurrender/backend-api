import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import routerConfig from "./cores/configs/router.config";
import { sequelizeConfigAsync } from "./cores/configs/sequelize.config";
import { NotificationListener } from "./cores/event-emitter/notification.listener";
import { ResponseModule } from "./cores/modules/response/response.module";
import { AuthModule } from "./features/auth/auth.module";
import { DeviceCategoryModule } from "./features/device-category/device-category.module";
import { NotificationModule } from "./features/notification/public/notification.module";
import { TariffClassesModule } from "./features/tariff-class/tariff-class.module";
import { UserModule } from "./features/user/user.module";
import { HouseholdModule } from './features/household/household.module';
import { DeviceModule } from './features/device/device.module';
import { DeviceUsageModule } from './features/device-usage/device-usage.module';
import { ExportReportModule } from './features/export-report/export-report.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      cache: true,
    }),
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    routerConfig,
    AuthModule,
    ResponseModule,
    UserModule,
    NotificationModule,
    DeviceCategoryModule,
    TariffClassesModule,
    HouseholdModule,
    DeviceModule,
    DeviceUsageModule,
    ExportReportModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
