import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlModuleOptions } from "@nestjs/graphql";
import path from "path";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions
} from "nest-winston";
import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { PrismaClientOptions } from "@prisma/client/runtime";

/**
 * アプリケーションで使用する設定値を取得するクラス
 */
@Injectable()
export class PbEnv {
  constructor(private configService: ConfigService) { }

  isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  get service(): ConfigService {
    return this.configService;
  }

  get NodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get Port(): number {
    return this.configService.get('PORT');
  }

  get DatabaseUrl(): string {
    return this.configService.get('DATABASE_URL');
  }

  get PrismaOptionsFactory(): PrismaClientOptions {
    const logOptions = {
      development: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      production: [{ emit: 'event', level: 'warn' }],
      test: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    };
    console.log(this.NodeEnv);
    return {
      errorFormat: 'colorless',
      rejectOnNotFound: true,
      log: logOptions[this.NodeEnv],
    };
  }

  get GqlModuleOptionsFactory(): GqlModuleOptions {
    const devOptions: GqlModuleOptions = {
      autoSchemaFile: path.join(
        process.cwd(),
        'src/generated/graphql/schema.gql',
      ),
      sortSchema: true,
      debug: true,
      // playground(検証環境を使用できるよう設定)
      playground: true,
    };

    const prdOptions: GqlModuleOptions = {
      autoSchemaFile: true,
      debug: false,
      playground: false,
    };

    if (this.isProduction()) {
      return prdOptions;
    } else {
      return devOptions;
    }
  }

  get WinstonModuleOptionsFactory(): WinstonModuleOptions {
    const loggingConsole = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        nestWinstonModuleUtilities.format.nestLike('PB_BACKEND', {
          prettyPrint: true,
        }),
      ),
    });
    const loggingCloudLogging = new LoggingWinston({
      serviceContext: {
        service: 'pb-backend',
        version: '1.0.0',
      },
    });
    return {
      level: this.isProduction() ? 'info' : 'debug',
      transports: this.isProduction()
        ? [loggingConsole, loggingCloudLogging]
        : [loggingConsole],
    };
  }
}
