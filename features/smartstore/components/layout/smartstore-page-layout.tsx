'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SmartStorePageLayoutProps {
  renderIntro: () => ReactNode
  renderStats: () => ReactNode
  renderSections: Array<() => ReactNode>
  className?: string
}

export function SmartStorePageLayout({
  renderIntro,
  renderStats,
  renderSections,
  className,
}: SmartStorePageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={cn('container mx-auto px-6 py-8 space-y-8', className)}>
        <section className="space-y-8">
          {renderIntro()}
          {renderStats()}
        </section>
        {renderSections.map((renderSection, index) => (
          <section key={`smartstore-section-${index}`}>{renderSection()}</section>
        ))}
      </main>
    </div>
  )
}
