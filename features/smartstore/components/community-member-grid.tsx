'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { SmartStoreMember } from '@/features/smartstore/types'

interface CommunityMemberGridProps {
  members: SmartStoreMember[]
  title?: string
  description?: string
  badgeLabel?: string
  heightClassName?: string
}

export function CommunityMemberGrid({
  members,
  title = '그룹 구성원',
  description = '상품 등록 권한이 있는 커뮤니티 멤버 목록입니다',
  badgeLabel = '그룹원',
  heightClassName = 'h-56',
}: CommunityMemberGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${heightClassName} pr-4`}>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge variant="outline">{badgeLabel}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
