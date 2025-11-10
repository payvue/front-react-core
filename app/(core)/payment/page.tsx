"use client"

import { PaymentMethods } from "@/features/asset/method/components/payment-methods"
import { OnlineAssets } from "@/features/asset/summary/components/online-assets"
import { MoneyTransfer } from "@/components/payment/money-transfer"
import Recurrent from "@/components/payment/scheduled-payments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChargeBalance from "@/components/payment/charge-balance"
import PayProvider from "@/features/pay/contexts/pay"
import Scheduled from "@/features/pay/recurrent/scheduled/components/scheduled-payment"
import AutoCharge from "@/features/pay/recurrent/charged/components/auto-charge"

export default function PaymentPage() {

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">결제 관리</h1>
        <p className="text-muted-foreground">결제 수단, 잔액 충전, 온라인 재화를 관리하세요</p>
      </header>
      <Tabs defaultValue="charge" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="charge">잔액 충전</TabsTrigger>
            <TabsTrigger value="scheduled">예약 결제</TabsTrigger>
            <TabsTrigger value="assets">온라인 재화</TabsTrigger>
            <TabsTrigger value="transfer">송금</TabsTrigger>
            <TabsTrigger value="methods">결제 수단</TabsTrigger>
          </TabsList>

          <PayProvider> 
            <TabsContent value="charge" className="space-y-6">
              <ChargeBalance/>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Recurrent defaultValue="auto-charge">
                <Recurrent.Tab value="auto-charge" label="자동 충전">
                  <AutoCharge />
                </Recurrent.Tab>
                <Recurrent.Tab value="scheduled" label="예약 결제">
                  <Scheduled />
                </Recurrent.Tab>
              </Recurrent>
            </TabsContent>            
          </PayProvider>            

            <TabsContent value="assets" className="space-y-6">
              <OnlineAssets />
            </TabsContent>

            <TabsContent value="transfer" className="space-y-6">
              <MoneyTransfer />
            </TabsContent>


            <TabsContent value="methods" className="space-y-6">
              <PaymentMethods />
            </TabsContent>                                
      </Tabs>
    </div>
  )
}
