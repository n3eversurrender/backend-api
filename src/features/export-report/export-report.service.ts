import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { DeviceUsage } from "../device-usage/entities/device-usage.entity";
import { Device } from "../device/entities/device.entity";
import { Household } from "../household/entities/household.entity";
import { TariffClass } from "../tariff-class/entities/tariff-class.entity";
import { User } from "../user/entities/user.entity";
import * as puppeteer from "puppeteer";

@Injectable()
export class ExportReportService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(DeviceUsage)
    private readonly deviceUsageModel: typeof DeviceUsage,
    @InjectModel(Device)
    private readonly deviceModel: typeof Device,
    @InjectModel(Household)
    private readonly householdModel: typeof Household
  ) {}

  async generatePdfReport(
    user: User,
    startDate: string,
    endDate: string
  ): Promise<Buffer> {
    // 1. Fetch user's household & tariff details
    const household = await this.householdModel.findOne({
      where: { user_id: user.id },
      include: [TariffClass],
    });

    const householdName = household?.name ?? "My Household";
    const address = household?.address ?? "N/A";
    const tariffCode = (household as any)?.tariff_class?.code ?? "R-1/TR";
    const tariffType = (household as any)?.tariff_class?.type ?? "Household";
    const capacityVa = (household as any)?.tariff_class?.capacity_va ?? 1300;
    const pricePerKwh = Number((household as any)?.tariff_class?.price_per_kwh ?? 1444);

    // 2. Fetch usages in date range
    const usages = await this.deviceUsageModel.findAll({
      include: [
        {
          model: Device,
          required: true,
          where: { user_id: user.id },
        },
      ],
      where: {
        usage_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["usage_date", "ASC"]],
    });

    // 3. Compute stats
    const totalKwh = usages.reduce((sum, u) => sum + Number(u.estimated_kwh), 0);
    const totalCost = totalKwh * pricePerKwh;
    
    // Unique days count
    const uniqueDays = new Set(usages.map((u) => u.usage_date)).size || 1;
    const avgKwhPerDay = totalKwh / uniqueDays;

    // 4. Generate HTML content with beautiful layout and styling
    const formatDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    const periodLabel = startDate === endDate 
      ? formatDate(startDate) 
      : `${formatDate(startDate)} – ${formatDate(endDate)}`;

    const tableRows = usages.map((u, index) => {
      const devName = (u as any).device?.name ?? "Unknown Device";
      const devWatt = (u as any).device?.wattage ?? 0;
      const kwh = Number(u.estimated_kwh);
      const cost = kwh * pricePerKwh;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${formatDate(u.usage_date)}</td>
          <td><b>${devName}</b></td>
          <td class="text-right">${devWatt} W</td>
          <td class="text-right">${Number(u.usage_hours).toFixed(1)} hrs</td>
          <td class="text-right text-green">${kwh.toFixed(2)} kWh</td>
          <td class="text-right text-weight-bold">Rp ${Math.round(cost).toLocaleString("id-ID")}</td>
        </tr>
      `;
    }).join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Energy Consumption Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            color: #333333;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.5;
          }
          
          .report-container {
            padding: 10px;
          }

          /* Header Section */
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .header-left {
            width: 60%;
            vertical-align: top;
          }
          .header-right {
            width: 40%;
            vertical-align: top;
            text-align: right;
          }
          
          .app-title {
            font-size: 16px;
            font-weight: 700;
            color: #22b07e;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .report-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 10px 0;
          }

          .info-label {
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 2px;
          }
          
          .info-val {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
          }

          /* KPI Stats Block */
          .kpi-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            gap: 12px;
          }
          
          .kpi-card {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
          }
          
          .kpi-card--green {
            background: #f0fff8;
            border-color: #c8eedd;
          }
          
          .kpi-title {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }
          
          .kpi-value {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
          }
          
          .kpi-value--green {
            color: #15803d;
          }

          /* Tables Styling */
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          
          .data-table th {
            background-color: #22b07e;
            color: white;
            text-align: left;
            font-weight: 600;
            padding: 8px 10px;
            font-size: 10px;
            text-transform: uppercase;
          }
          
          .data-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          
          .data-table tr:nth-child(even) td {
            background-color: #f8fafc;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-green {
            color: #16a34a;
            font-weight: 600;
          }
          
          .text-weight-bold {
            font-weight: 700;
            color: #0f172a;
          }

          /* Footer decoration */
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            text-align: center;
            color: #94a3b8;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- HEADER -->
          <table class="header-table">
            <tr>
              <td class="header-left">
                <div class="app-title">Smart Power Monitoring</div>
                <h1 class="report-title">Electricity Usage Report</h1>
                <div class="info-label">Report Period</div>
                <div class="info-val" style="color: #22b07e;">${periodLabel}</div>
              </td>
              <td class="header-right">
                <div class="info-label">Household Name</div>
                <div class="info-val">${householdName}</div>
                <div class="info-label">Tariff Class & Power</div>
                <div class="info-val">${tariffCode} (${tariffType}) &bull; ${capacityVa} VA</div>
                <div class="info-label">Price per kWh</div>
                <div class="info-val">Rp ${pricePerKwh.toLocaleString("id-ID")} / kWh</div>
              </td>
            </tr>
          </table>
          
          <!-- STATS CARDS -->
          <div class="kpi-container">
            <div class="kpi-card kpi-card--green">
              <div class="kpi-title" style="color: #15803d;">Total Consumption</div>
              <div class="kpi-value kpi-value--green">${totalKwh.toFixed(2)} kWh</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Estimated Cost</div>
              <div class="kpi-value">Rp ${Math.round(totalCost).toLocaleString("id-ID")}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Daily Average Usage</div>
              <div class="kpi-value">${avgKwhPerDay.toFixed(2)} kWh/day</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Logs Recorded</div>
              <div class="kpi-value">${usages.length} logs</div>
            </div>
          </div>

          <!-- TABLE OF LOGS -->
          <h3 style="font-size: 12px; margin: 0 0 10px 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
            Detailed Consumption Table
          </h3>
          
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Date</th>
                <th style="width: 30%">Device Name</th>
                <th class="text-right" style="width: 12%">Power (Watt)</th>
                <th class="text-right" style="width: 12%">Active Hours</th>
                <th class="text-right" style="width: 13%">Energy (kWh)</th>
                <th class="text-right" style="width: 13%">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.length > 0 ? tableRows : `
                <tr>
                  <td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">
                    No consumption logs found in this period.
                  </td>
                </tr>
              `}
            </tbody>
          </table>

          <!-- FOOTER -->
          <div class="footer">
            Report automatically generated by Smart Power Monitoring DSS System &bull; &copy; 2026 Page 1 of 1
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Generate PDF via Puppeteer with graceful error handling
    let browser: puppeteer.Browser | null = null;
    try {
      browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          "--no-sandbox", 
          "--disable-setuid-sandbox",
          "--disable-web-security"
        ],
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "15mm",
          right: "15mm",
        },
      });

      return Buffer.from(pdf);
    } catch (err) {
      console.error("Puppeteer PDF generation failed, falling back to empty stream", err);
      throw new Error("Failed to compile PDF: " + err.message);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
