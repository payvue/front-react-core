"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GroupList } from "@/components/groups/group-list"

export default function GroupsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
      return
    }
    setIsLoggedIn(true)
  }, [])

  if (!isLoggedIn) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <GroupList />
      </main>
    </div>
  )
}
