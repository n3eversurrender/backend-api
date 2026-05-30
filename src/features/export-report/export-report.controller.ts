import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { User } from "../user/entities/user.entity";
import { ExportReportService } from "./export-report.service";

@Controller()
export class ExportReportController {
  constructor(private readonly exportReportService: ExportReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get("pdf")
  async exportPdf(
    @CurrentUser() user: User,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Res() res: any
  ) {
    try {
      if (!startDate || !endDate) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "startDate and endDate are required query parameters" });
      }

      const pdfBuffer = await this.exportReportService.generatePdfReport(
        user,
        startDate,
        endDate
      );

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=usage_report_${startDate}_to_${endDate}.pdf`,
        "Content-Length": pdfBuffer.length,
      });

      return res.end(pdfBuffer);
    } catch (error: any) {
      console.error("PDF export failed", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to generate report", error: error.message });
    }
  }
}

