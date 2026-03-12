"use client"

import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { providers } from '@/features/pay/types/providers'
import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'

type ProviderSelectionProps = {
  selected: SelectedMethod
  disabled: boolean
  onSelect: (providerId: string) => void
}

const ProviderSelection = ({ selected, disabled, onSelect }: ProviderSelectionProps) => {
  const selectedProviderId = selected?.type === 'provider' ? selected.id : null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base">간편결제</h3>
        <span className="text-xs text-gray-500">빠르고 안전한 결제</span>
      </div>

      <div className="space-y-2">
        {providers.map(provider => {
          const isSelected = selectedProviderId === provider.id
          const isUnsupported = provider.supported === false
          const isDisabled = disabled || isUnsupported

          return (
            <button
              key={provider.id}
              onClick={() => {
                if (isUnsupported) {
                  alert('카카오페이는 현재 지원하지 않습니다')
                  return
                }
                onSelect(provider.id)
              }}
              disabled={isDisabled}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-200 ${
                    isSelected ? 'border-primary shadow-sm' : 'border-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold">
                    {provider.id === 'naver' && <span className="text-green-500">N</span>}
                    {provider.id === 'kakao' && <span className="text-yellow-500">K</span>}
                    {provider.id === 'toss' && <span className="text-blue-500">₮</span>}
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold transition-colors ${isSelected ? 'text-primary' : ''}`}>
                      {provider.name}
                    </span>
                    {provider.badge && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                        {provider.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{provider.description}</div>
                  {isUnsupported && (
                    <div className="text-xs text-red-500 mt-1">현재 지원하지 않습니다</div>
                  )}
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 animate-in zoom-in duration-200" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProviderSelection
