import {ConflictException, Injectable} from '@nestjs/common';
import {RegisterDto} from "@/auth/dto/register.dto";
import {UserService} from "@/user/user.service";
import {AuthMethod} from "@prisma/client";
import {User} from "@/prisma/__generated__";


@Injectable()
export class AuthService {
    public constructor(private readonly userService: UserService) {}

    public async register(dto: RegisterDto) {
        const isExist = await this.userService.findByEmail(dto.email);

        if (isExist) {
            throw new ConflictException('Пользователь с таким email уже существует')
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        return this.saveSession(newUser)
    }

    public async login() {}

    public async logout() {}

    public async saveSession(user: User) {
        console.log('Session saved. user:', user);
        return user
    }
}
