import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/lib/redux/provider"
import { Suspense } from "react"
import "./globals.css"
import { AppProvider } from "@/lib/contexts/app-context"
import UserProvider from "@/components/context/user"
import APIProvider from "@/components/context/api"
import CommunityProvider from "@/components/context/community"
import AlarmProvider from "@/components/context/alarm"

export const metadata: Metadata = {
  title: "PayEasy - 스마트한 간편결제",
  description: "안전하고 빠른 온라인 결제 플랫폼",
  generator: "v0.app",
}

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <ReduxProvider>
            <APIProvider>
                <AppProvider>
                    <UserProvider>
                      <AlarmProvider>
                        <CommunityProvider>
                          {children} 
                        </CommunityProvider> 
                      </AlarmProvider>
                    </UserProvider>
                  </AppProvider>          
            </APIProvider>
          </ReduxProvider>         
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
