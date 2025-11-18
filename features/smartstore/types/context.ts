import type { SmartStoreInfo, SmartStoreMember } from './store'
import type { SmartStoreSummaryItem } from './stats'

export interface SmartStorePageContextValue {
  stores: SmartStoreInfo[]
  selectedStore: SmartStoreInfo | null
  communityMembers: SmartStoreMember[]
  manager?: SmartStoreMember
  summaryStat: SmartStoreSummaryItem[]
  selectedStoreId: string
  setSelectedStoreId: (storeId: string) => void
}
