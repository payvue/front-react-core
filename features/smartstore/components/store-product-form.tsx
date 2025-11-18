'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import type { ProductCategoryOption } from '@/features/product/types'
import type { SmartStoreMember, StoreProductDraft } from '@/features/smartstore/types'
import { useStoreProductForm } from '@/features/smartstore/hooks/use-store-product-form'

interface StoreProductFormProps {
  communityMembers: SmartStoreMember[]
  categoryOptions: ProductCategoryOption[]
  disabled?: boolean
  onSubmit: (draft: StoreProductDraft) => void
}

export function StoreProductForm({
  communityMembers,
  categoryOptions,
  disabled,
  onSubmit,
}: StoreProductFormProps) {
  const [open, setOpen] = useState(false)
  const { isValid, formState, handleChange, handleSubmit } = useStoreProductForm({
    communityMembers,
    categoryOptions,
  })

  const handleFormSubmit = () => {
    const draft = handleSubmit()
    if (!draft) return
    onSubmit(draft)
    setOpen(false)
  }

  const handleDialogChange = (value: boolean) => {
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          상품 등록
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 상품 등록</DialogTitle>
          <DialogDescription>커뮤니티 멤버가 등록할 상품 정보를 입력하세요</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            handleFormSubmit()
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">상품 이름</Label>
              <Input
                id="product-name"
                value={formState.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="예: 스마트 미니빔"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">상품 설명</Label>
              <Textarea
                id="product-description"
                value={formState.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder="상품의 주요 특징을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-price">가격 (원)</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  value={formState.price}
                  onChange={(event) => handleChange('price', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-quantity">판매 수량</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  min="0"
                  value={formState.quantity}
                  onChange={(event) => handleChange('quantity', event.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
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
                <Label>등록자</Label>
                <Select
                  value={formState.authorId}
                  onValueChange={(value) => handleChange('authorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="등록자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {communityMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <img
                src={formState.image || defaultImage}
                alt="업로드된 이미지"
                className="h-16 w-16 rounded-lg border object-cover"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">이미지 업로드</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    handleChange('image', url)
                  }}
                />
              </div>
            </div>
            <Button type="submit" disabled={!isValid}>
              저장하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
