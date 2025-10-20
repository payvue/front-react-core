"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useOnlineAssetsQuery } from "../hooks/useOnlineAssetsQuery"
import { OnlineAssetModel } from "../model/online-asset"
import OnlineAssetList from "./online-asset-list"

const categoryOptions = [
  { value: "gift", label: "기프트 카드" },
  { value: "game", label: "게임" },
  { value: "music", label: "음악" },
  { value: "shopping", label: "쇼핑" },
  { value: "cash", label: "캐시" },
  { value: "mileage", label: "마일리지" },
] as const

type CategoryOptionValue = (typeof categoryOptions)[number]["value"]

export function OnlineAssets() {
  const { assets, isLoading, isError, refetch } = useOnlineAssetsQuery()
  const [items, setItems] = useState<OnlineAssetModel[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: categoryOptions[0].value,
    amount: "",
  })

  useEffect(() => {
    setItems(assets)
  }, [assets])

  const showEmptyState = useMemo(
    () => items.length === 0 && !isLoading && !isError,
    [isError, isLoading, items.length],
  )

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.amount) {
      return
    }

    const amount = Number.parseInt(newAsset.amount, 10)

    if (Number.isNaN(amount)) {
      return
    }

    const asset = OnlineAssetModel.fromResponse({
      id: Date.now().toString(),
      name: newAsset.name,
      category: newAsset.category,
      amount,
      purchaseDate: new Date().toISOString(),
      status: "active",
      balance: amount,
    })

    setItems((prev) => [asset, ...prev])
    setNewAsset({ name: "", category: categoryOptions[0].value, amount: "" })
    setIsAddDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>온라인 재화 관리</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            새로고침
          </Button>
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
                <div className="space-y-2">
                  <Label htmlFor="assetName">재화 이름</Label>
                  <Input
                    id="assetName"
                    placeholder="예: 구글 플레이 기프트카드"
                    value={newAsset.name}
                    onChange={(event) => setNewAsset({ ...newAsset, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetCategory">카테고리</Label>
                  <Select
                    value={newAsset.category}
                    onValueChange={(value) =>
                      setNewAsset({ ...newAsset, category: value as CategoryOptionValue })
                    }
                  >
                    <SelectTrigger id="assetCategory">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetAmount">금액</Label>
                  <Input
                    id="assetAmount"
                    type="number"
                    placeholder="금액을 입력하세요"
                    value={newAsset.amount}
                    onChange={(event) => setNewAsset({ ...newAsset, amount: event.target.value })}
                  />
                </div>
                <Button onClick={handleAddAsset} className="w-full">
                  추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <OnlineAssetList
          assets={items}
          isLoading={isLoading}
          isError={isError}
          showEmptyState={showEmptyState}
        />
      </CardContent>
    </Card>
  )
}
