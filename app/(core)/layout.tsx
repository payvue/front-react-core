"use client"

import type React from 'react'
import { useState } from 'react'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { GroupMembersSidebar } from '@/components/groups/group-members-sidebar'

interface CoreLayoutProps {
  children: React.ReactNode
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="relative">
        <main
          className={`transition-all duration-300 ease-in-out min-h-[calc(100vh-5rem-3rem)] ${
            isSidebarCollapsed ? 'pl-0' : 'md:pl-64 pl-0'
          }`}
        >
          <div className="container mx-auto px-6 py-8 space-y-8">
          {children}
          </div>
        </main>
        <GroupMembersSidebar onCollapseChange={setIsSidebarCollapsed} />
      </div>
      <footer className="bg-purple-80 border-t border-purple-200 px-6 py-4 pt-8">
        <div className="text-center text-sm text-gray-900 font-serif italic font-semibold">
          © 2024 PayEasy. All rights reserved. | 간편결제 플랫폼
        </div>
      </footer>
    </div>
  )
}
