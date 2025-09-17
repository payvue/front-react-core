"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Plus, Share, Gamepad2, Music, ShoppingCart } from "lucide-react"

interface SharedAsset {
  id: string
  name: string
  category: "game" | "music" | "gift" | "shopping"
  amount: number
  sharedBy: string
  sharedDate: string
  usedBy: string[]
  totalUses: number
  maxUses: number
  status: "available" | "exhausted"
}

const mockSharedAssets: SharedAsset[] = [
  {
    id: "1",
    name: "넷플릭스 프리미엄 구독권",
    category: "music",
    amount: 17000,
    sharedBy: "김아빠",
    sharedDate: "2024-01-10",
    usedBy: ["김엄마", "김형"],
    totalUses: 2,
    maxUses: 4,
    status: "available",
  },
  {
    id: "2",
    name: "스타벅스 기프트카드",
    category: "gift",
    amount: 50000,
    sharedBy: "김엄마",
    sharedDate: "2024-01-08",
    usedBy: ["김아빠", "김사용자"],
    totalUses: 2,
    maxUses: 10,
    status: "available",
  },
  {
    id: "3",
    name: "스팀 게임 라이브러리",
    category: "game",
    amount: 120000,
    sharedBy: "김형",
    sharedDate: "2024-01-05",
    usedBy: ["김사용자"],
    totalUses: 1,
    maxUses: 3,
    status: "available",
  },
]

export function SharedAssets() {
  const [assets, setAssets] = useState(mockSharedAssets)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "gift" as const,
    amount: "",
    maxUses: "",
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

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.amount || !newAsset.maxUses) return

    const asset: SharedAsset = {
      id: Date.now().toString(),
      name: newAsset.name,
      category: newAsset.category,
      amount: Number.parseInt(newAsset.amount),
      sharedBy: "김사용자",
      sharedDate: new Date().toISOString().split("T")[0],
      usedBy: [],
      totalUses: 0,
      maxUses: Number.parseInt(newAsset.maxUses),
      status: "available",
    }

    setAssets([asset, ...assets])
    setNewAsset({ name: "", category: "gift", amount: "", maxUses: "" })
    setIsAddDialogOpen(false)
  }

  const handleUseAsset = (assetId: string) => {
    setAssets(
      assets.map((asset) => {
        if (asset.id === assetId && asset.totalUses < asset.maxUses) {
          const newTotalUses = asset.totalUses + 1
          return {
            ...asset,
            usedBy: [...asset.usedBy, "김사용자"],
            totalUses: newTotalUses,
            status: newTotalUses >= asset.maxUses ? ("exhausted" as const) : ("available" as const),
          }
        }
        return asset
      }),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          공유 온라인 재화
        </CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              재화 공유
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 온라인 재화 공유</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assetName">재화 이름</Label>
                <Input
                  id="assetName"
                  placeholder="예: 넷플릭스 구독권"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
              <div>
                <Label>카테고리</Label>
                <Select
                  value={newAsset.category}
                  onValueChange={(value: "game" | "music" | "gift" | "shopping") =>
                    setNewAsset({ ...newAsset, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gift">기프트카드</SelectItem>
                    <SelectItem value="game">게임</SelectItem>
                    <SelectItem value="music">음악/영상</SelectItem>
                    <SelectItem value="shopping">쇼핑</SelectItem>
                  </SelectContent>
                </Select>
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
              <div>
                <Label htmlFor="maxUses">최대 사용 횟수</Label>
                <Input
                  id="maxUses"
                  type="number"
                  placeholder="최대 몇 번까지 사용 가능한지 입력하세요"
                  value={newAsset.maxUses}
                  onChange={(e) => setNewAsset({ ...newAsset, maxUses: e.target.value })}
                />
              </div>
              <Button onClick={handleAddAsset} className="w-full">
                그룹에 공유하기
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{asset.sharedBy}님이 공유</span>
                  <span>•</span>
                  <span>{asset.sharedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    사용: {asset.totalUses}/{asset.maxUses}회
                  </span>
                  <Badge variant={asset.status === "available" ? "secondary" : "outline"}>
                    {asset.status === "available" ? "사용 가능" : "사용 완료"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(asset.amount)}원</p>
              <Button
                size="sm"
                variant="outline"
                disabled={asset.status === "exhausted"}
                onClick={() => handleUseAsset(asset.id)}
                className="mt-2 bg-transparent"
              >
                사용하기
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
