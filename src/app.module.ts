import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {IS_DEV_ENV} from "@/libs/common/utils/is-dev.util";
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import {AuthModule} from "@/auth/auth.module";
import { ProviderModule } from '@/auth/provider/provider.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: !IS_DEV_ENV, // в production НЕ читать .env файл
        isGlobal: true, // модуль доступен во всем приложении
      }),
      PrismaModule,
      AuthModule,
      UserModule,
      ProviderModule,
  ],
})
export class AppModule {}
