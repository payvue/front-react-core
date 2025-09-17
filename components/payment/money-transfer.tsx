"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Clock, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface TransferHistory {
  id: string
  recipient: User
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  message?: string
}

export function MoneyTransfer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  // Mock data
  const users: User[] = [
    { id: "1", name: "김민수", email: "minsu@example.com", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "이영희", email: "younghee@example.com", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "박철수", email: "chulsoo@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const transferHistory: TransferHistory[] = [
    {
      id: "1",
      recipient: users[0],
      amount: 50000,
      status: "completed",
      date: "2024-01-15",
      message: "점심값 송금",
    },
    {
      id: "2",
      recipient: users[1],
      amount: 30000,
      status: "pending",
      date: "2024-01-14",
      message: "카페비 송금",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTransfer = async () => {
    if (!selectedUser || !amount) return

    setIsTransferring(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(`${selectedUser.name}님에게 ₩${Number.parseInt(amount).toLocaleString()}을 송금했습니다.`)

    // Reset form
    setSelectedUser(null)
    setAmount("")
    setMessage("")
    setIsTransferring(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료"
      case "pending":
        return "대기중"
      default:
        return "실패"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="transfer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transfer">송금하기</TabsTrigger>
          <TabsTrigger value="history">송금 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                온라인 재화 송금
              </CardTitle>
              <CardDescription>다른 사용자에게 보유중인 온라인 재화를 송금할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Search */}
              <div className="space-y-4">
                <Label htmlFor="search">받는 사람 검색</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="이름 또는 이메일로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {searchQuery && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected User */}
              {selectedUser && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">선택된 받는 사람</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedUser.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">송금 금액</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="송금할 금액을 입력하세요"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">보유 잔액: ₩150,000</p>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message">메시지 (선택사항)</Label>
                <Input
                  id="message"
                  placeholder="송금 메시지를 입력하세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Transfer Button */}
              <Button
                onClick={handleTransfer}
                disabled={!selectedUser || !amount || isTransferring}
                className="w-full"
                size="lg"
              >
                {isTransferring ? "송금 중..." : `₩${amount ? Number.parseInt(amount).toLocaleString() : 0} 송금하기`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>송금 내역</CardTitle>
              <CardDescription>최근 송금 내역을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferHistory.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={transfer.recipient.avatar || "/placeholder.svg"}
                          alt={transfer.recipient.name}
                        />
                        <AvatarFallback>{transfer.recipient.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transfer.recipient.name}</p>
                        <p className="text-sm text-muted-foreground">{transfer.message}</p>
                        <p className="text-xs text-muted-foreground">{transfer.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-₩{transfer.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end">
                        {getStatusIcon(transfer.status)}
                        <span className="text-sm">{getStatusText(transfer.status)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
