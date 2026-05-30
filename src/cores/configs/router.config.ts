import { RouterModule } from "@nestjs/core";
import { AuthModule } from "src/features/auth/auth.module";
import { DeviceCategoryModule } from "src/features/device-category/device-category.module";
import { DeviceUsageModule } from "src/features/device-usage/device-usage.module";
import { DeviceModule } from "src/features/device/device.module";
import { HouseholdModule } from "src/features/household/household.module";
import { NotificationModule } from "src/features/notification/public/notification.module";
import { TariffClassesModule } from "src/features/tariff-class/tariff-class.module";
import { UserModule } from "src/features/user/user.module";
import { ExportReportModule } from "src/features/export-report/export-report.module";


export default RouterModule.register([
  {
    path: "/api/v1",
    children: [
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "notifications",
        module: NotificationModule,
      },
      {
        path: "tariff-classes",
        module: TariffClassesModule,
      },
      {
        path: "device-categories",
        module: DeviceCategoryModule,
      },
      {
        path: "devices",
        module: DeviceModule,
        children: [
          {
            path: ":deviceId/device-usages",
            module: DeviceUsageModule,
          },
        ],
      },
      {
        path: "households",
        module: HouseholdModule,
      },
      {
        path: "export-report",
        module: ExportReportModule,
      },
    ],
  },
]);
