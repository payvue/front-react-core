"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Settings, LogOut, CreditCard, Package, BarChart3, Users, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface DashboardUser {
  id: string
  name: string
  email: string
  balance: number
}

export function DashboardHeader() {
  const [user, setUser] = useState<DashboardUser | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  if (!user) return null

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-primary cursor-pointer">PayEasy</h1>
          </Link>
          <p className="text-sm text-muted-foreground">간편결제 플랫폼</p>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
            대시보드
          </Link>
          <Link href="/payment" className="text-sm font-medium hover:text-primary">
            결제 관리
          </Link>
          <Link href="/assets" className="text-sm font-medium hover:text-primary">
            자산 관리
          </Link>
          <Link href="/groups" className="text-sm font-medium hover:text-primary">
            그룹 계정
          </Link>
          <Link href="/analytics" className="text-sm font-medium hover:text-primary">
            거래 분석
          </Link>
          <Link href="/shopping" className="text-sm font-medium hover:text-primary">
            쇼핑
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  결제 관리
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/assets">
                  <Package className="mr-2 h-4 w-4" />
                  자산 관리
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/groups">
                  <Users className="mr-2 h-4 w-4" />
                  그룹 계정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  거래 분석
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/shopping">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  쇼핑
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
