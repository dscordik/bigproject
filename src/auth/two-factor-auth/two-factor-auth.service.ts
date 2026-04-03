import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/prisma/prisma.service";
import {MailService} from "@/libs/mail/mail.service";
import {v4 as uuidv4} from "uuid";
import {TokenType} from "@prisma/client";
import {User} from "@/prisma/__generated__";

@Injectable()
export class TwoFactorAuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {}

    public async validateTwoFactorToken(email: string, code: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        });

        if (!existingToken) {
            throw new NotFoundException('Токен двухфакторой аутентификации не найден');
        }

        if(existingToken.token !== code) {
            throw new BadRequestException('Неверный код двухфакторой аутентификации');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException('Срок действия двухфакторой аутентификации истек');
        }

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.TWO_FACTOR,
            }
        });

        return true
    }

    public async sendTwoFactorToken(email: string) {
        const twoFactorToken = await this.generateTwoFactorToken(email);
        await this.mailService.sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
        return true;
    }

    private async generateTwoFactorToken(email: string) {
        const token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
        const expiresIn = new Date(new Date().getTime() + 300000);

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        });

        if (existingToken) {
            // ИСПРАВЛЕНО: убран type из where
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.TWO_FACTOR,
                }
            });
        }

        const twoFactorToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.TWO_FACTOR
            }
        });

        return twoFactorToken;
    }
}
