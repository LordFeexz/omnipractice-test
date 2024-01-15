import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ForbiddenException } from "@nestjs/common";
import { APP_BASE_URL } from "./constant";
import helmet from "helmet";
import { config } from "dotenv";
import { AllExceptionsFilter } from "./middlewares/errorHandler";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      referrerPolicy: { policy: "same-origin" },
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin(requestOrigin, callback) {
      const whiteList = process.env.CORS_LIST ?? "";
      if (whiteList.indexOf(requestOrigin as string) !== -1) {
        callback(null, true);
      } else {
        callback(
          new ForbiddenException(`Not allowed by CORS for URL ${requestOrigin}`)
        );
      }
    },
  });

  app.setGlobalPrefix(APP_BASE_URL);

  await app.listen(3000);
}
bootstrap();
