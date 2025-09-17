"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Clock, CheckCircle, XCircle, Send, AlertCircle, Calendar } from "lucide-react"

interface PaymentRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  amount: number
  description: string
  category: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  urgency: "low" | "medium" | "high"
}

interface GroupMember {
  id: string
  name: string
  role: "leader" | "member"
  avatar?: string
}

export function PaymentRequests({
  groupId,
  currentUserId,
  isGroupLeader,
}: {
  groupId: string
  currentUserId: string
  isGroupLeader: boolean
}) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data
  const groupMembers: GroupMember[] = [
    { id: "1", name: "김그룹장", role: "leader", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "이멤버", role: "member", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "박멤버", role: "member", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const paymentRequests: PaymentRequest[] = [
    {
      id: "1",
      requesterId: "2",
      requesterName: "이멤버",
      requesterAvatar: "/placeholder.svg?height=40&width=40",
      amount: 50000,
      description: "회사 점심 회식비",
      category: "식음료",
      requestDate: "2024-01-15",
      status: "pending",
      urgency: "high",
    },
    {
      id: "2",
      requesterId: "3",
      requesterName: "박멤버",
      requesterAvatar: "/placeholder.svg?height=40&width=40",
      amount: 25000,
      description: "프로젝트 관련 서적 구매",
      category: "도서",
      requestDate: "2024-01-14",
      status: "approved",
      approvedDate: "2024-01-14",
      urgency: "medium",
    },
    {
      id: "3",
      requesterId: "2",
      requesterName: "이멤버",
      requesterAvatar: "/placeholder.svg?height=40&width=40",
      amount: 15000,
      description: "택시비",
      category: "교통",
      requestDate: "2024-01-13",
      status: "rejected",
      rejectedDate: "2024-01-13",
      rejectionReason: "개인 교통비는 지원하지 않습니다.",
      urgency: "low",
    },
  ]

  const handleSubmitRequest = async () => {
    if (!amount || !description || !category) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert(`₩${Number.parseInt(amount).toLocaleString()} 결제 요청이 전송되었습니다.`)

    setAmount("")
    setDescription("")
    setCategory("")
    setUrgency("medium")
    setIsSubmitting(false)
  }

  const handleApproveRequest = async (requestId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    alert("결제 요청이 승인되었습니다.")
  }

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt("거부 사유를 입력해주세요:")
    if (!reason) return

    await new Promise((resolve) => setTimeout(resolve, 500))
    alert("결제 요청이 거부되었습니다.")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            대기중
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            거부됨
          </Badge>
        )
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            긴급
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
            보통
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            낮음
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            보통
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const pendingRequests = paymentRequests.filter((req) => req.status === "pending")
  const completedRequests = paymentRequests.filter((req) => req.status !== "pending")

  return (
    <div className="space-y-6">
      <Tabs defaultValue={isGroupLeader ? "manage" : "request"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">결제 요청</TabsTrigger>
          <TabsTrigger value="manage">{isGroupLeader ? "요청 관리" : "내 요청"}</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-6">
          {!isGroupLeader && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  그룹장에게 결제 요청
                </CardTitle>
                <CardDescription>그룹 예산으로 결제가 필요한 항목을 요청할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">요청 금액</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="금액을 입력하세요"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Input
                      id="category"
                      placeholder="예: 식음료, 교통, 사무용품"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="결제 요청 사유를 자세히 설명해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>긴급도</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((level) => (
                      <Button
                        key={level}
                        variant={urgency === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUrgency(level as "low" | "medium" | "high")}
                      >
                        {level === "low" ? "낮음" : level === "medium" ? "보통" : "긴급"}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSubmitRequest}
                  disabled={!amount || !description || !category || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting
                    ? "요청 전송 중..."
                    : `₩${amount ? Number.parseInt(amount).toLocaleString() : 0} 결제 요청`}
                </Button>
              </CardContent>
            </Card>
          )}

          {isGroupLeader && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  그룹장 안내
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  그룹장으로서 멤버들의 결제 요청을 관리할 수 있습니다. "요청 관리" 탭에서 대기 중인 요청을 확인하고
                  승인/거부하세요.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {isGroupLeader && pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  대기 중인 요청 ({pendingRequests.length}건)
                </CardTitle>
                <CardDescription>승인 또는 거부가 필요한 결제 요청입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={request.requesterAvatar || "/placeholder.svg"}
                              alt={request.requesterName}
                            />
                            <AvatarFallback>{request.requesterName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.requesterName}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {request.requestDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getUrgencyBadge(request.urgency)}
                          <span className="font-bold text-lg">{formatCurrency(request.amount)}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium mb-1">{request.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {request.category}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleApproveRequest(request.id)} className="flex-1" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          거부
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {isGroupLeader ? "처리된 요청" : "내 요청 내역"}
              </CardTitle>
              <CardDescription>
                {isGroupLeader
                  ? "승인 또는 거부된 결제 요청 내역입니다"
                  : "제출한 결제 요청의 처리 상태를 확인할 수 있습니다"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={request.requesterAvatar || "/placeholder.svg"}
                            alt={request.requesterName}
                          />
                          <AvatarFallback>{request.requesterName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.requesterName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            요청: {request.requestDate}
                            {request.approvedDate && (
                              <>
                                <span>•</span>
                                승인: {request.approvedDate}
                              </>
                            )}
                            {request.rejectedDate && (
                              <>
                                <span>•</span>
                                거부: {request.rejectedDate}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <span className="font-bold text-lg">{formatCurrency(request.amount)}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium mb-1">{request.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {request.category}
                      </Badge>
                    </div>

                    {request.status === "rejected" && request.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          <strong>거부 사유:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}
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
