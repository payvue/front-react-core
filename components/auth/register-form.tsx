"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    setIsLoading(true)

    // Simulate registration process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful registration
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "1",
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        balance: 0,
        isLoggedIn: true,
      }),
    )

    setIsLoading(false)
    window.location.href = "/dashboard"
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card
      className="w-full max-w-md mx-auto shadow-xl border-0"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
    >
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: "#e9d5ff" }}>
            <UserPlus className="h-8 w-8" style={{ color: "#7c3aed" }} />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold" style={{ color: "#581c87" }}>
          회원가입
        </CardTitle>
        <CardDescription style={{ color: "#6b46c1" }}>
          간편결제 플랫폼에 가입하여 안전한 결제를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" style={{ color: "#581c87" }}>
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#581c87" }}>
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: "#581c87" }}>
              전화번호
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#581c87" }}>
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "#7c3aed" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "#7c3aed" }} />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: "#581c87" }}>
              비밀번호 확인
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "#7c3aed" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "#7c3aed" }} />
                )}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full text-white hover:opacity-90"
            disabled={isLoading}
            style={{ backgroundColor: "#7c3aed" }}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
