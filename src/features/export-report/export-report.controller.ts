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
        "Content-Type": "application/octet-stream",
        "Content-Length": pdfBuffer.length,
      });

      return res.end(pdfBuffer);
    } catch (error: any) {
      console.error("PDF export failed", error);
      try {
        const fs = require('fs');
        const logMsg = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`;
        fs.appendFileSync('error.log', logMsg);
      } catch (logErr) {
        console.error("Failed to write to error.log", logErr);
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to generate report", error: error.message });
    }
  }
}

