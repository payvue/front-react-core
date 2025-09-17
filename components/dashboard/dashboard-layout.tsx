"use client"

import type React from "react"

import { DashboardHeader } from "./dashboard-header"
import { GroupMembersSidebar } from "../groups/group-members-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="relative">
        <main className="pl-80 min-h-[calc(100vh-4rem-3rem)]">{children}</main>
        <GroupMembersSidebar />
      </div>
      <footer className="bg-purple-100 border-t border-purple-200 px-6 py-4 pt-8">
        <div className="text-center text-sm text-gray-900 font-serif italic font-semibold">
          © 2024 PayEasy. All rights reserved. | 간편결제 플랫폼
        </div>
      </footer>
    </div>
  )
}
