"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Calendar, Edit2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profile, setProfile] = useState({
    userId: "user_12345",
    nickname: "김핀테크",
    email: "user@fintech.com",
    joinDate: "2023-01-15",
    status: "활성",
  })
  const [editProfile, setEditProfile] = useState(profile)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveProfile = () => {
    setProfile(editProfile)
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    // 비밀번호 변경 로직
    console.log("비밀번호 변경:", passwordData)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsChangingPassword(false)
  }

  return (
    <div className="space-y-6">
      {/* 프로필 정보 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              프로필 정보
            </CardTitle>
            <CardDescription>회원 정보를 조회하고 수정할 수 있습니다</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              수정
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">사용자 ID</Label>
              <div className="flex items-center gap-2">
                <Input id="userId" value={profile.userId} disabled className="bg-muted" />
                <Badge variant="secondary">고유 ID</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              {isEditing ? (
                <Input
                  id="nickname"
                  value={editProfile.nickname}
                  onChange={(e) => setEditProfile({ ...editProfile, nickname: e.target.value })}
                />
              ) : (
                <Input value={profile.nickname} disabled />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                />
              ) : (
                <Input value={profile.email} disabled />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">가입일</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="joinDate"
                  value={new Date(profile.joinDate).toLocaleDateString("ko-KR")}
                  disabled
                  className="bg-muted"
                />
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label>계정 상태:</Label>
            <Badge variant="default" className="bg-green-100 text-green-800">
              {profile.status}
            </Badge>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditProfile(profile)
                  setIsEditing(false)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 비밀번호 변경 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            비밀번호 변경
          </CardTitle>
          <CardDescription>계정 보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>비밀번호 변경하기</Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleChangePassword}>
                  <Save className="h-4 w-4 mr-2" />
                  변경하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    setIsChangingPassword(false)
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
