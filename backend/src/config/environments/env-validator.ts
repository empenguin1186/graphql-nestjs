import { plainToClass } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumberString, IsString, validateSync } from "class-validator";

enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * バリデーションを行いたい環境変数を列挙
 */
export class EnvValidator {
  @IsEnum(NodeEnvEnum)
  NODE_ENV: NodeEnvEnum;

  @IsNumberString()
  PORT = 3000;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;
}

/**
 * バリデーションを行うための関数
 * @param config バリデーション対象の config.
 * @returns バリデーション済みの Record<string, unknown>
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}