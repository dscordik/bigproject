import type { Metadata } from 'next'
import {LoginForm} from "@/src/features/auth/components";

export const metadata: Metadata = {
    title: 'Войти аккаунт'
}

export default function LoginPage() {
    return <LoginForm />
}