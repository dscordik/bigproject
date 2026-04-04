import type { Metadata } from 'next'
import {RegisterForm} from "@/src/features/auth/components";

export const metadata: Metadata = {
    title: 'Создать аккаунт'
}

export default function RegisterPage() {
    return <RegisterForm/>
}