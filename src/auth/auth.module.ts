import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from "@/user/user.module";
import {GoogleRecaptchaModule} from "@nestlab/google-recaptcha";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getRecaptchaConfig} from "@/config/recaptcha.config";
import {ProviderModule} from "@/auth/provider/provider.module";
import {getProviderConfig} from "@/config/providers.config";
import {EmailConfirmationModule} from "@/auth/email-confirmation/email-confirmation.module";
import {UserService} from "@/user/user.service";
import {MailService} from "@/libs/mail/mail.service";
import {TwoFactorAuthService} from "@/auth/two-factor-auth/two-factor-auth.service";

@Module({
  imports: [
      UserModule,
      ProviderModule.registerAsync({
        imports: [ConfigModule],
        useFactory: getProviderConfig,
        inject: [ConfigService],
      }),
      GoogleRecaptchaModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: getRecaptchaConfig,
          inject: [ConfigService],
      }),
      forwardRef(() => EmailConfirmationModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, TwoFactorAuthService],
  exports: [AuthService],
})
export class AuthModule {}
