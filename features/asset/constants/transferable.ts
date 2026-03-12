import { OnlineAssetCategory } from '../summary/types/online-asset'

/**
 * 전송 불가능한 자산 카테고리
 * 현재 payvue 캐시와 마일리지는 전송 불가능
 */
export const NON_TRANSFERABLE_CATEGORIES: OnlineAssetCategory[] = ['cash', 'mileage']

/**
 * 자산이 전송 가능한지 확인
 */
export const isTransferable = (category: OnlineAssetCategory): boolean => {
  return !NON_TRANSFERABLE_CATEGORIES.includes(category)
}

/**
 * 전송 불가능한 자산의 설명 메시지
 */
export const getNonTransferableMessage = (category: OnlineAssetCategory): string | null => {
  switch (category) {
    case 'cash':
      return 'Payvue 캐시는 전송이 불가능합니다.'
    case 'mileage':
      return '마일리지는 전송이 불가능합니다.'
    default:
      return null
  }
}
