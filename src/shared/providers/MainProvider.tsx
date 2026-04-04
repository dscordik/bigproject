'use client'

import { type PropsWithChildren} from "react";
import {TanstackQueryProvider} from "@/src/shared/providers/TanstackQueryProvider";
import {ThemeProvider} from "next-themes";
import { ToastProvider } from "./ToastProvider";

export function MainProvider({children}:PropsWithChildren<unknown>) {
    return (
        <TanstackQueryProvider>
            <ThemeProvider attribute='class' defaultTheme='light' disableTransitionOnChange>
                <ToastProvider />
                {children}
            </ThemeProvider>
        </TanstackQueryProvider>
    )
}