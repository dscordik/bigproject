import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {IS_DEV_ENV} from "@/libs/common/utils/is-dev.util";
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: !IS_DEV_ENV, // в production НЕ читать .env файл
        isGlobal: true, // модуль доступен во всем приложении
      }),
      PrismaModule,
  ],
})
export class AppModule {}
