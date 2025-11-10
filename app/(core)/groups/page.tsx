'use client'

import { GroupList } from '@/components/groups/group-list'

export default function GroupsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">그룹</h1>
        <p className="text-muted-foreground">참여 중인 그룹을 둘러보고 관리하세요</p>
      </header>
      <GroupList />
    </div>
  )
}
