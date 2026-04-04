'use client'

import {AuthWrapper} from "@/src/features/auth/components/AuthWrapper";
import {useForm} from "react-hook-form";
import {LoginSchema, TypeLoginSchema, TypeRegisterSchema} from "@/src/features/schemes";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/src/shared/components/ui";
import { Input } from "@/src/shared/components/ui/Input";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {useState} from "react";
import {toast} from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import {useLoginMutation} from "@/src/features/auth/hooks";

export function LoginForm() {
    const { theme } = useTheme();
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '' ,
            password: ''
        }
    })

    const {login, isLoadingLogin} = useLoginMutation();

    const onSubmit = (values: TypeLoginSchema) => {
        if (recaptchaValue) {
            login({values, recaptcha: recaptchaValue});
        } else {
            toast.error("Please enter your captcha");
        }
    }

    return <AuthWrapper
        heading='Войти'
        description='Чтобы войти на сайт введите email и password'
        backButtonLabel='Еще нет аккаунта? Регистрация'
        backButtonHref='/auth/register'
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Почта</FormLabel>
                            <FormControl>
                                <Input placeholder='ivan@exmple.com' disabled={isLoadingLogin} type='email' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input placeholder='******' disabled={isLoadingLogin} type='password' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className='flex justify-center'>
                    <ReCAPTCHA
                        sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                        onChange={setRecaptchaValue}
                        theme={theme === "light" ? "light" : "dark"}
                    />
                </div>
                <Button type='submit' disabled={isLoadingLogin}>Войти в акаунт</Button>
            </form>
        </Form>
    </AuthWrapper>
}