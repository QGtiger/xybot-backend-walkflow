import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';

const getEnvFiles = () => {
  const env = process.env.NODE_ENV || 'development';
  const baseFiles = [`.env.${env}.local`, `.env.local`, `.env.${env}`, '.env'];
  return baseFiles.filter((path: string) => existsSync(path)); // 过滤不存在的文件
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFiles(), // 优先级从左到右
      isGlobal: true, // 全局可用
      validate: (config) => {
        // 验证配置（可选）
        // 使用 Joi 或自定义验证逻辑
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(configService);
        return {
          type: 'mysql',
          host: configService.get('MYSQL_SERVER_HOST'),
          port: configService.get('MYSQL_SERVER_PORT'),
          username: configService.get('MYSQL_SERVER_USER'),
          password: configService.get('MYSQL_SERVER_PASSWORD'),
          database: configService.get('MYSQL_SERVER_DATABASE'),
          synchronize: true,
          logging: true,
          entities: [],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
