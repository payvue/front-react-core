'use client'

import type { ReactNode } from 'react'

interface ShoppingIntroSectionProps {
  title: string
  description: string
  icon?: ReactNode
}

export function ShoppingIntroSection({ title, description, icon }: ShoppingIntroSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {icon}
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
