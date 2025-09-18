"use client"

import { useState, useEffect, useRef } from "react"
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

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
          
          {/* Debug indicator */}
          {/* {dropdownOpen && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-[10000]">
              Dropdown is open!
            </div>
          )} */}

          {/* Simple dropdown without Radix UI for testing */}
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              type="button"
              onClick={() => {
                console.log('Dropdown trigger clicked, current state:', dropdownOpen)
                setDropdownOpen(!dropdownOpen)
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user?.name ?? "사용자"}</span>
            </Button>
            
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                <div className="py-1">
                  <Link href="/payment" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <CreditCard className="mr-2 h-4 w-4" />
                    결제 관리
                  </Link>
                  <Link href="/assets" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <Package className="mr-2 h-4 w-4" />
                    자산 관리
                  </Link>
                  <Link href="/groups" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <Users className="mr-2 h-4 w-4" />
                    그룹 계정
                  </Link>
                  <Link href="/analytics" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    거래 분석
                  </Link>
                  <Link href="/shopping" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    쇼핑
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
