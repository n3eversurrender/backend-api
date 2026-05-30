import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { Handler } from "./cores/exceptions/handler.exception";
import { Response } from "./cores/interceptions/response.interception";
import express = require("express");

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("query parser", "extended");
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new Handler(httpAdapter));
  app.useGlobalInterceptors(new Response());
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
