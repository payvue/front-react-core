"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ShoppingCart, Gift, Gamepad2, Music } from "lucide-react"

interface OnlineAsset {
  id: string
  name: string
  category: "game" | "music" | "gift" | "shopping"
  amount: number
  purchaseDate: string
  status: "active" | "used" | "expired"
}

const mockAssets: OnlineAsset[] = [
  {
    id: "1",
    name: "구글 플레이 기프트카드",
    category: "gift",
    amount: 50000,
    purchaseDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "스팀 월렛",
    category: "game",
    amount: 30000,
    purchaseDate: "2024-01-10",
    status: "used",
  },
  {
    id: "3",
    name: "스포티파이 프리미엄",
    category: "music",
    amount: 10900,
    purchaseDate: "2024-01-01",
    status: "active",
  },
]

export function OnlineAssets() {
  const [assets, setAssets] = useState(mockAssets)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "gift" as const,
    amount: "",
  })

  const getIcon = (category: string) => {
    switch (category) {
      case "game":
        return <Gamepad2 className="h-5 w-5" />
      case "music":
        return <Music className="h-5 w-5" />
      case "gift":
        return <Gift className="h-5 w-5" />
      case "shopping":
        return <ShoppingCart className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            사용 가능
          </Badge>
        )
      case "used":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            사용 완료
          </Badge>
        )
      case "expired":
        return <Badge variant="destructive">만료</Badge>
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.amount) return

    const asset: OnlineAsset = {
      id: Date.now().toString(),
      name: newAsset.name,
      category: newAsset.category,
      amount: Number.parseInt(newAsset.amount),
      purchaseDate: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setAssets([asset, ...assets])
    setNewAsset({ name: "", category: "gift", amount: "" })
    setIsAddDialogOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>온라인 재화 관리</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 온라인 재화 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assetName">재화 이름</Label>
                <Input
                  id="assetName"
                  placeholder="예: 구글 플레이 기프트카드"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="assetAmount">금액</Label>
                <Input
                  id="assetAmount"
                  type="number"
                  placeholder="금액을 입력하세요"
                  value={newAsset.amount}
                  onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
                />
              </div>
              <Button onClick={handleAddAsset} className="w-full">
                추가하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">{getIcon(asset.category)}</div>
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-muted-foreground">구매일: {asset.purchaseDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(asset.amount)}원</p>
              {getStatusBadge(asset.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
