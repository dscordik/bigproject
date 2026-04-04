import {TypeLoginSchema, TypeRegisterSchema} from "@/src/features/schemes";
import {api} from "@/src/shared/api";
import {IUser} from "@/src/features/auth/types/user.types";

class AuthService {
    public async register(body: TypeRegisterSchema, recaptcha?:string) {
        const headers = recaptcha ? {recaptcha} : undefined

        const response = await api.post<IUser>('auth/register', body, {
            headers
        })

        return response;
    }

    public async login(body: TypeLoginSchema, recaptcha?:string) {
        const headers = recaptcha ? {recaptcha} : undefined

        const response = await api.post<IUser>('auth/login', body, {
            headers
        })

        return response;
    }

    public async logout() {
        const response = await api.post('auth/logout');

        return response
    }
}

export const authService = new AuthService();