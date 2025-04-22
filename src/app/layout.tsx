import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Providers from "./providers";
import { AuthProvider } from "@/context/auth-context";
import { Suspense } from "react";
import RootLoading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ЛК Сотрудника",
  description: "Личный кабинет сотрудника",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AuthProvider>
            <Providers>
              <Suspense fallback={<RootLoading />}>
                {children}
              </Suspense>
            </Providers>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
