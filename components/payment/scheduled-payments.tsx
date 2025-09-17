"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, CreditCard, Settings, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface AutoChargeRule {
  id: string
  name: string
  triggerType: "balance_below" | "date_based" | "usage_based"
  triggerValue: number
  chargeAmount: number
  paymentMethod: string
  isActive: boolean
  lastTriggered?: string
  nextTrigger?: string
}

interface ScheduledPayment {
  id: string
  merchantName: string
  amount: number
  paymentMethod: string
  scheduleType: "monthly" | "weekly" | "yearly"
  nextPaymentDate: string
  status: "active" | "paused" | "failed"
  lastPaymentDate?: string
  failureReason?: string
}

export function ScheduledPayments() {
  const [autoChargeRules, setAutoChargeRules] = useState<AutoChargeRule[]>([
    {
      id: "1",
      name: "잔액 부족시 자동 충전",
      triggerType: "balance_below",
      triggerValue: 10000,
      chargeAmount: 50000,
      paymentMethod: "신한카드 (**** 1234)",
      isActive: true,
      nextTrigger: "잔액이 ₩10,000 이하가 될 때",
    },
    {
      id: "2",
      name: "월초 정기 충전",
      triggerType: "date_based",
      triggerValue: 1,
      chargeAmount: 100000,
      paymentMethod: "국민은행 (110-***-*****)",
      isActive: false,
      nextTrigger: "2024-02-01",
    },
  ])

  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    {
      id: "1",
      merchantName: "넷플릭스 프리미엄",
      amount: 17000,
      paymentMethod: "PayEasy 잔액",
      scheduleType: "monthly",
      nextPaymentDate: "2024-02-15",
      status: "active",
      lastPaymentDate: "2024-01-15",
    },
    {
      id: "2",
      merchantName: "스포티파이 프리미엄",
      amount: 10900,
      paymentMethod: "신한카드 (**** 1234)",
      scheduleType: "monthly",
      nextPaymentDate: "2024-02-10",
      status: "failed",
      lastPaymentDate: "2024-01-10",
      failureReason: "잔액 부족",
    },
    {
      id: "3",
      merchantName: "Adobe Creative Cloud",
      amount: 24000,
      paymentMethod: "PayEasy 잔액",
      scheduleType: "monthly",
      nextPaymentDate: "2024-02-20",
      status: "paused",
      lastPaymentDate: "2024-12-20",
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    triggerType: "balance_below" as const,
    triggerValue: "",
    chargeAmount: "",
    paymentMethod: "",
  })

  const [newScheduledPayment, setNewScheduledPayment] = useState({
    merchantName: "",
    amount: "",
    paymentMethod: "",
    scheduleType: "monthly" as const,
    nextPaymentDate: "",
  })

  const handleCreateAutoChargeRule = () => {
    if (!newRule.name || !newRule.triggerValue || !newRule.chargeAmount || !newRule.paymentMethod) return

    const rule: AutoChargeRule = {
      id: Date.now().toString(),
      name: newRule.name,
      triggerType: newRule.triggerType,
      triggerValue: Number.parseInt(newRule.triggerValue),
      chargeAmount: Number.parseInt(newRule.chargeAmount),
      paymentMethod: newRule.paymentMethod,
      isActive: true,
      nextTrigger:
        newRule.triggerType === "balance_below"
          ? `잔액이 ₩${Number.parseInt(newRule.triggerValue).toLocaleString()} 이하가 될 때`
          : "설정된 조건에 따라",
    }

    setAutoChargeRules([...autoChargeRules, rule])
    setNewRule({ name: "", triggerType: "balance_below", triggerValue: "", chargeAmount: "", paymentMethod: "" })
    alert("자동 충전 규칙이 생성되었습니다!")
  }

  const handleCreateScheduledPayment = () => {
    if (
      !newScheduledPayment.merchantName ||
      !newScheduledPayment.amount ||
      !newScheduledPayment.paymentMethod ||
      !newScheduledPayment.nextPaymentDate
    )
      return

    const payment: ScheduledPayment = {
      id: Date.now().toString(),
      merchantName: newScheduledPayment.merchantName,
      amount: Number.parseInt(newScheduledPayment.amount),
      paymentMethod: newScheduledPayment.paymentMethod,
      scheduleType: newScheduledPayment.scheduleType,
      nextPaymentDate: newScheduledPayment.nextPaymentDate,
      status: "active",
    }

    setScheduledPayments([...scheduledPayments, payment])
    setNewScheduledPayment({
      merchantName: "",
      amount: "",
      paymentMethod: "",
      scheduleType: "monthly",
      nextPaymentDate: "",
    })
    alert("예약 결제가 등록되었습니다!")
  }

  const toggleAutoChargeRule = (ruleId: string) => {
    setAutoChargeRules(
      autoChargeRules.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)),
    )
  }

  const toggleScheduledPayment = (paymentId: string) => {
    setScheduledPayments(
      scheduledPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: payment.status === "active" ? "paused" : "active" } : payment,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            활성
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            일시정지
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            실패
          </Badge>
        )
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  const getScheduleTypeText = (type: string) => {
    switch (type) {
      case "monthly":
        return "매월"
      case "weekly":
        return "매주"
      case "yearly":
        return "매년"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="auto-charge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auto-charge">자동 충전</TabsTrigger>
          <TabsTrigger value="scheduled">예약 결제</TabsTrigger>
        </TabsList>

        <TabsContent value="auto-charge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                자동 충전 규칙 생성
              </CardTitle>
              <CardDescription>
                특정 조건을 만족할 때 자동으로 잔액을 충전하는 규칙을 설정할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">규칙 이름</Label>
                  <Input
                    id="ruleName"
                    placeholder="예: 잔액 부족시 자동 충전"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>충전 조건</Label>
                  <Select
                    value={newRule.triggerType}
                    onValueChange={(value: "balance_below" | "date_based" | "usage_based") =>
                      setNewRule({ ...newRule, triggerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance_below">잔액이 특정 금액 이하일 때</SelectItem>
                      <SelectItem value="date_based">특정 날짜마다</SelectItem>
                      <SelectItem value="usage_based">사용량 기준</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="triggerValue">
                    {newRule.triggerType === "balance_below" ? "기준 잔액" : "기준 값"}
                  </Label>
                  <Input
                    id="triggerValue"
                    type="number"
                    placeholder={newRule.triggerType === "balance_below" ? "10000" : "값을 입력하세요"}
                    value={newRule.triggerValue}
                    onChange={(e) => setNewRule({ ...newRule, triggerValue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chargeAmount">충전 금액</Label>
                  <Input
                    id="chargeAmount"
                    type="number"
                    placeholder="50000"
                    value={newRule.chargeAmount}
                    onChange={(e) => setNewRule({ ...newRule, chargeAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>결제 수단</Label>
                <Select
                  value={newRule.paymentMethod}
                  onValueChange={(value) => setNewRule({ ...newRule, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="결제 수단을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card1">신한카드 (**** 1234)</SelectItem>
                    <SelectItem value="bank1">국민은행 (110-***-*****)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateAutoChargeRule} className="w-full" size="lg">
                자동 충전 규칙 생성
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                활성 자동 충전 규칙
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {autoChargeRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{rule.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {rule.nextTrigger} → {formatCurrency(rule.chargeAmount)} 충전
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "활성" : "비활성"}
                        </Badge>
                        <Switch checked={rule.isActive} onCheckedChange={() => toggleAutoChargeRule(rule.id)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>{rule.paymentMethod}</span>
                      {rule.lastTriggered && (
                        <>
                          <span>•</span>
                          <span>마지막 실행: {rule.lastTriggered}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />새 예약 결제 등록
              </CardTitle>
              <CardDescription>정기적으로 결제되는 구독 서비스나 정기 결제를 등록할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="merchantName">가맹점명</Label>
                  <Input
                    id="merchantName"
                    placeholder="예: 넷플릭스, 스포티파이"
                    value={newScheduledPayment.merchantName}
                    onChange={(e) => setNewScheduledPayment({ ...newScheduledPayment, merchantName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">결제 금액</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="17000"
                    value={newScheduledPayment.amount}
                    onChange={(e) => setNewScheduledPayment({ ...newScheduledPayment, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>결제 주기</Label>
                  <Select
                    value={newScheduledPayment.scheduleType}
                    onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                      setNewScheduledPayment({ ...newScheduledPayment, scheduleType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">매월</SelectItem>
                      <SelectItem value="weekly">매주</SelectItem>
                      <SelectItem value="yearly">매년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextPaymentDate">다음 결제일</Label>
                  <Input
                    id="nextPaymentDate"
                    type="date"
                    value={newScheduledPayment.nextPaymentDate}
                    onChange={(e) =>
                      setNewScheduledPayment({ ...newScheduledPayment, nextPaymentDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>결제 수단</Label>
                <Select
                  value={newScheduledPayment.paymentMethod}
                  onValueChange={(value) => setNewScheduledPayment({ ...newScheduledPayment, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="결제 수단을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payeasy">PayEasy 잔액</SelectItem>
                    <SelectItem value="card1">신한카드 (**** 1234)</SelectItem>
                    <SelectItem value="bank1">국민은행 (110-***-*****)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateScheduledPayment} className="w-full" size="lg">
                예약 결제 등록
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                등록된 예약 결제
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{payment.merchantName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getScheduleTypeText(payment.scheduleType)} {formatCurrency(payment.amount)} 결제
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payment.status)}
                        <Switch
                          checked={payment.status === "active"}
                          onCheckedChange={() => toggleScheduledPayment(payment.id)}
                          disabled={payment.status === "failed"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{payment.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>다음 결제: {payment.nextPaymentDate}</span>
                        {payment.lastPaymentDate && (
                          <>
                            <span>•</span>
                            <span>마지막 결제: {payment.lastPaymentDate}</span>
                          </>
                        )}
                      </div>
                      {payment.status === "failed" && payment.failureReason && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>실패 사유: {payment.failureReason}</span>
                        </div>
                      )}
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
