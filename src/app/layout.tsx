import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../shared/styles/globals.css";
import {MainProvider} from "@/src/shared/providers";
import {ToggleTheme} from "@/src/shared/components/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    absolute: 'Курс по авторизации',
    template: '%s | ККурс по авторизации'
  },
  description: 'Это учебный проект, созданный для демострациии полного цикла авторизации пользователей',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <MainProvider>
          <div className='relative flex min-h-screen flex-col'>
            <ToggleTheme/>
            <div className='flex h-screen w-full items-center justify-center px-4'>
              {children}
            </div>
          </div>
        </MainProvider>
      </body>
    </html>
  );
}
