"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, MapPin } from "lucide-react"

export default function CompleteProfilePage() {
  const [oauthData, setOauthData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    birthYear: "",
    occupation: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const tempData = localStorage.getItem("oauthTemp")
    if (tempData) {
      const parsed = JSON.parse(tempData)
      setOauthData(parsed)
      setFormData((prev) => ({
        ...prev,
        name: parsed.name || "",
      }))
    } else {
      // Redirect if no OAuth data
      window.location.href = "/login"
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate profile completion
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Complete registration
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "oauth-" + Date.now(),
        email: oauthData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        birthYear: formData.birthYear,
        occupation: formData.occupation,
        balance: 0,
        isLoggedIn: true,
        provider: oauthData.provider,
      }),
    )

    // Remove temp data
    localStorage.removeItem("oauthTemp")

    setIsLoading(false)
    window.location.href = "/dashboard"
  }

  if (!oauthData) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">프로필 완성</CardTitle>
          <CardDescription>
            {oauthData.provider} 계정으로 로그인하셨습니다.
            <br />
            추가 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="실명을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="010-1234-5678"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">주소</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="서울시 강남구..."
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear">출생년도</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, birthYear: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="출생년도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => 2024 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">직업</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, occupation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="직업 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">학생</SelectItem>
                  <SelectItem value="employee">직장인</SelectItem>
                  <SelectItem value="freelancer">프리랜서</SelectItem>
                  <SelectItem value="business">사업자</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 완료 중..." : "가입 완료"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
