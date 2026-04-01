import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Загружаем .env файл
dotenv.config();

// Проверка режима разработки (через ConfigService)
export const isDev = (configService: ConfigService): boolean =>
    configService.get('NODE_ENV') === 'development';

// Проверка режима разработки (через process.env)
export const IS_DEV_ENV: boolean = process.env.NODE_ENV === 'development';