import type {PropsWithChildren} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/src/shared/components/ui";
import { Button } from "@/src/shared/components/ui/Button"
import Link from "next/link";
import {AuthSocial} from "@/src/features/auth/components/AuthSocial";

interface AuthWrapperProps {
    heading: string,
    description?: string,
    backButtonLabel?: string,
    backButtonHref?: string,
    isShowSocial?: boolean
}

export function AuthWrapper({children, heading, description, backButtonLabel, backButtonHref, isShowSocial=false}: PropsWithChildren<AuthWrapperProps>) {
    return <Card className='w-[400px]'>
        <CardHeader className='space-y-2'>
            <CardTitle>{heading}</CardTitle>
            {description && (
                <CardDescription>{description}</CardDescription>
            )}
        </CardHeader>
        <CardContent>
            {isShowSocial && <AuthSocial />}
            {children}
        </CardContent>
        <CardFooter>
            {backButtonLabel && backButtonHref && (
                <Button variant='link' className='w-full font-normal'>
                    <Link href={backButtonHref}>{backButtonLabel}</Link>
                </Button>
            )}
        </CardFooter>
    </Card>
}