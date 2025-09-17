"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PaymentLimits() {
  const [limits, setLimits] = useState({
    dailyLimit: 500000,
    monthlyLimit: 10000000,
    enableDailyLimit: true,
    enableMonthlyLimit: true,
    enableNotifications: true,
  })

  const [usage] = useState({
    dailyUsed: 150000,
    monthlyUsed: 3500000,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    // Show success message (in real app, use toast)
    alert("결제 한도가 성공적으로 업데이트되었습니다.")
  }

  const dailyProgress = (usage.dailyUsed / limits.dailyLimit) * 100
  const monthlyProgress = (usage.monthlyUsed / limits.monthlyLimit) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>결제 한도 설정</CardTitle>
          </div>
          <CardDescription>안전한 결제를 위해 일일 및 월간 결제 한도를 설정하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Limit */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-limit" className="text-base font-medium">
                일일 결제 한도
              </Label>
              <Switch
                checked={limits.enableDailyLimit}
                onCheckedChange={(checked) => setLimits((prev) => ({ ...prev, enableDailyLimit: checked }))}
              />
            </div>

            {limits.enableDailyLimit && (
              <>
                <div className="space-y-2">
                  <Input
                    id="daily-limit"
                    type="number"
                    value={limits.dailyLimit}
                    onChange={(e) => setLimits((prev) => ({ ...prev, dailyLimit: Number(e.target.value) }))}
                    placeholder="일일 한도 (원)"
                  />
                  <div className="text-sm text-muted-foreground">
                    현재 사용: {usage.dailyUsed.toLocaleString()}원 / {limits.dailyLimit.toLocaleString()}원
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>일일 사용량</span>
                    <span>{dailyProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={dailyProgress} className="h-2" />
                </div>
              </>
            )}
          </div>

          {/* Monthly Limit */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-limit" className="text-base font-medium">
                월간 결제 한도
              </Label>
              <Switch
                checked={limits.enableMonthlyLimit}
                onCheckedChange={(checked) => setLimits((prev) => ({ ...prev, enableMonthlyLimit: checked }))}
              />
            </div>

            {limits.enableMonthlyLimit && (
              <>
                <div className="space-y-2">
                  <Input
                    id="monthly-limit"
                    type="number"
                    value={limits.monthlyLimit}
                    onChange={(e) => setLimits((prev) => ({ ...prev, monthlyLimit: Number(e.target.value) }))}
                    placeholder="월간 한도 (원)"
                  />
                  <div className="text-sm text-muted-foreground">
                    현재 사용: {usage.monthlyUsed.toLocaleString()}원 / {limits.monthlyLimit.toLocaleString()}원
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>월간 사용량</span>
                    <span>{monthlyProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={monthlyProgress} className="h-2" />
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">한도 알림</Label>
              <p className="text-sm text-muted-foreground">한도의 80% 도달 시 알림을 받습니다</p>
            </div>
            <Switch
              checked={limits.enableNotifications}
              onCheckedChange={(checked) => setLimits((prev) => ({ ...prev, enableNotifications: checked }))}
            />
          </div>

          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? "저장 중..." : "설정 저장"}
          </Button>
        </CardContent>
      </Card>

      {/* Warning Alerts */}
      {dailyProgress > 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            일일 결제 한도의 {dailyProgress.toFixed(1)}%를 사용했습니다. 남은 한도:{" "}
            {(limits.dailyLimit - usage.dailyUsed).toLocaleString()}원
          </AlertDescription>
        </Alert>
      )}

      {monthlyProgress > 80 && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            월간 결제 한도의 {monthlyProgress.toFixed(1)}%를 사용했습니다. 남은 한도:{" "}
            {(limits.monthlyLimit - usage.monthlyUsed).toLocaleString()}원
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
