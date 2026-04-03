import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import {ConfirmationTemplate} from "@/libs/mail/templates/confirmation.template";
import {render} from "@react-email/components";
import {ResetPasswordTemplate} from "@/libs/mail/templates/reset-password.template";
import {TwoFactorAuthTemplate} from "@/libs/mail/templates/two-factor-auth.template";

@Injectable()
export class MailService {
    public constructor(private readonly mailerService: MailerService,
        private readonly configService: ConfigService,) {}

    public async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ConfirmationTemplate({domain, token}))

        return this.sendMail(email, 'Подтвреждение почты',  html)
    }

    public async sendPasswordResetEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ResetPasswordTemplate({domain, token}))

        return this.sendMail(email, 'Сброс пароля',  html)
    }

    public async sendTwoFactorTokenEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(TwoFactorAuthTemplate({token}))

        return this.sendMail(email, 'Подтверждение личности',  html)
    }

    private sendMail(email:string, subject:string, html:string) {
        return this.mailerService.sendMail({
            to:email,
            subject,
            html
        })
    }
}
