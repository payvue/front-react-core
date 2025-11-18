'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ShoppingPageProvider } from '@/features/shopping/context'
import type { ShoppingPageContextValue } from '@/features/shopping/types'

interface ShoppingPageLayoutProps {
  contextValue: ShoppingPageContextValue
  renderIntro: () => ReactNode
  renderStats: () => ReactNode
  renderSections: Array<() => ReactNode>
  className?: string
}

export function ShoppingPageLayout({
  contextValue,
  renderIntro,
  renderStats,
  renderSections,
  className,
}: ShoppingPageLayoutProps) {
  return (
    <ShoppingPageProvider value={contextValue}>
      <div className="min-h-screen bg-background">
        <main className={cn('container mx-auto px-6 py-8 space-y-8', className)}>
          <section className="space-y-8">
            {renderIntro()}
            {renderStats()}
          </section>
          {renderSections.map((renderSection, index) => (
            <section key={`shopping-section-${index}`}>{renderSection()}</section>
          ))}
        </main>
      </div>
    </ShoppingPageProvider>
  )
}
