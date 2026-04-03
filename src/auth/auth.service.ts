import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {RegisterDto} from "@/auth/dto/register.dto";
import {UserService} from "@/user/user.service";
import {AuthMethod} from "@prisma/client";
import {User} from "@/prisma/__generated__";
import {Request, Response} from 'express';
import {LoginDto} from "@/auth/dto/login.dto";
import {verify} from "argon2";
import {ConfigService} from "@nestjs/config";
import {ProviderService} from "@/auth/provider/provider.service";
import {PrismaService} from "@/prisma/prisma.service";
import {EmailConfirmationService} from "@/auth/email-confirmation/email-confirmation.service";
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private  readonly twoFactorAuthService: TwoFactorAuthService,
    ) {}

    public async register(req: Request, dto: RegisterDto) {
        const isExist = await this.userService.findByEmail(dto.email);

        if (isExist) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false,
        );

        await this.emailConfirmationService.sendVerificationToken(newUser.email);

        return {
            message: 'Вы успешно зарегистрировались подтвердите свой email. Сообщение было отправлено на ваш почтовый адрес'
        }
    }

    public async login(req: Request, dto:  LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new NotFoundException('Пользователь не найден проверьте данные');
        }

        const isValidPassword = await verify(user.password, dto.password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный пароль попробуйте еще или восстановите его');
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email);
            throw new UnauthorizedException('Ваш email не подтвержден');
        }

        if (user.isTwoFactorEnabled) {
            if(!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email);

                return {
                    message: 'Проверьте почту требуется код двухфакторной аутентификации',
                }
            }

            await this.twoFactorAuthService.validateTwoFactorToken(user.email,  dto.code);
        }

        return await this.saveSession(req, user);
    }

    public async extractProfileFromCode(req:Request, provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider);
        const profile = await providerInstance?.findUserByCode(code);

        if (!profile) return null;

        const account = await this.prismaService.account.findFirst({
            where: {
                id: profile.id,
                provider: profile.provider
            }
        })

        let user = account?.userId ? await this.userService.findById(account.userId) : null;

        if(user) {
            return this.saveSession(req, user)
        }

        user = await this.userService.create(
            profile.email,
            '',
            profile.name,
            profile.picture,
            AuthMethod[profile.provider.toUpperCase()],
            true
        )

        if (!account) {
            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    type: 'oauth',
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at ?? 0
                }
            })
        }

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response) {
        return new Promise((resolve, reject):void => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException('Не удалось завершить сессию, возможно проблема с сервером или она завершена')
                    )
                }
                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
                resolve({ message: 'Logout successful' })
            })
        })
    }

    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return reject(
                        new InternalServerErrorException('Не удалось сохранить сессию'),
                    );
                }

                // Исключаем пароль из ответа
                const { password, ...userWithoutPassword } = user;

                resolve({
                    message: 'Регистрация успешна',
                    user: userWithoutPassword,
                });
            });
        });
    }
}