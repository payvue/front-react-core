"use client"

import { PaymentLimits } from "@/components/settings/payment-limits"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, User, Bell } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">설정</h1>
            <p className="text-muted-foreground">계정 및 결제 설정을 관리하세요</p>
          </div>
        </div>

        <Tabs defaultValue="limits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="limits" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              결제 한도
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              프로필
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              알림
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              보안
            </TabsTrigger>
          </TabsList>

          <TabsContent value="limits">
            <PaymentLimits />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>알림 수신 방법을 설정할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">알림 설정 기능이 곧 추가됩니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>계정 보안을 강화할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">보안 설정 기능이 곧 추가됩니다.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
