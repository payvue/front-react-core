'use client'

import { useEffect } from 'react'
import { GroupTransactions } from '@/components/groups/group-transactions'
import { GroupMembers } from '@/components/groups/group-members'
import { SharedAssets } from '@/components/groups/shared-assets'
import { PaymentRequests } from '@/components/groups/payment-requests'
import { GroupBalanceChargeDialog } from '@/components/groups/group-balance-charge'
import PayProvider from '@/features/pay/contexts/pay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, DollarSign, Settings, Crown } from 'lucide-react'
import { useUserContext } from '@/components/context/user'
import { formatCurrency } from '@/util/display'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/lib/redux/hooks'
import useAsyncAccountQuery from '@/features/account/useAsyncAccountQuery'
import { useCommunityContext } from '@/components/context/community'
import { isLeaderRole } from '@/features/community/utils/role'

export default function GroupDetailPage() {
  const { isAuthenticated } = useUserContext()
  const { id } = useParams()

  const { info: verified, asset } = useAppSelector((state) => state.auth.domain)
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated, true)
  const { newIssued } = useCommunityContext()
  const group = useAppSelector((state) => state.community.domain.groups).find(
    (group) => group.id === id,
  )
  const participant = group?.members?.find((m) => m.info.name === verified.name)
  const activeMembers = group?.members?.filter((m) => m.policy.active) ?? []

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }
  }, [])

  if (!group || !participant) {
    return (
      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{group.name}</h1>
              {isLeaderRole(participant.role) && <Crown className="h-6 w-6 text-yellow-500" />}
              <Badge variant={isLeaderRole(participant.role) ? 'default' : 'secondary'}>
                {isLeaderRole(participant.role) ? '리더' : '멤버'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{group.description}</p>
          </div>
          <div className="flex gap-2">
            <PayProvider>
              <GroupBalanceChargeDialog
                groupId={group.id}
                currentUserBalance={asset.balance}
                onChargeSuccess={() => {
                  fetch()
                  newIssued()
                }}
              />
            </PayProvider>
            {isLeaderRole(participant.role) && (
              <Button variant="outline" className="bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                그룹 설정
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">공용 잔액</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(group.shared.balance)}
              </div>
              <p className="text-xs text-muted-foreground">그룹 전체 사용 가능</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">그룹 멤버</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMembers.length}</div>
              <p className="text-xs text-muted-foreground">활성 멤버</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 사용</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">데이터 준비 중</div>
              <p className="text-xs text-muted-foreground">월간 사용 요약을 준비 중입니다</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">거래 내역</TabsTrigger>
          <TabsTrigger value="requests">결제 요청</TabsTrigger>
          <TabsTrigger value="members">멤버 관리</TabsTrigger>
          <TabsTrigger value="assets">공유 재화</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <GroupTransactions groupId={group.id} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <PaymentRequests
            groupId={group.id}
            currentUserId="current-user-id"
            isGroupLeader={isLeaderRole(participant.role)}
          />
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <GroupMembers group={group} participant={participant} />
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <SharedAssets groupId={group.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
