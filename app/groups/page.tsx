"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GroupList } from "@/components/groups/group-list"
import { useUserContext } from "@/components/context/user"

export default function GroupsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { isAuthenticated } = useUserContext()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <GroupList />
      </main>
    </div>
  )
}
