import axios from 'axios';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";
import { User } from "./src/features/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as fs from 'fs';

async function run() {
  let token = "";
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const jwtService = app.get(JwtService);
    const user = await User.findOne();
    if (!user) {
      console.error("No user found");
      await app.close();
      return;
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    token = jwtService.sign(payload);
    await app.close();
  } catch (err) {
    console.error("Error getting token:", err);
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `http://localhost:3000/api/v1/export-report/pdf?startDate=${today}&endDate=${today}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer'
    });
    
    const buffer = Buffer.from(res.data);
    console.log("Response length:", buffer.length);
    console.log("Start bytes (Hex):", buffer.slice(0, 10).toString('hex'));
    console.log("Start bytes (ASCII):", buffer.slice(0, 10).toString('ascii'));
    console.log("End bytes (Hex):", buffer.slice(-100).toString('hex'));
    console.log("End bytes (ASCII):", buffer.slice(-100).toString('ascii'));
    
    fs.writeFileSync('temp_report.pdf', buffer);
    console.log("Saved to temp_report.pdf");
  } catch (err: any) {
    console.error("HTTP Request Failed:", err.message);
  }
}

run();
