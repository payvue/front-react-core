'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

export interface SummaryCardHeaderProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  titleClassName?: string
}

export function SummaryCardHeader({
  title,
  description,
  action,
  className,
  titleClassName,
}: SummaryCardHeaderProps) {
  return (
    <CardHeader
      className={cn('flex flex-row items-center justify-between space-y-0 gap-3', className)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <CardTitle className={cn('text-sm font-medium', titleClassName)}>{title}</CardTitle>
        </div>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </CardHeader>
  )
}

export interface SummaryCardItem extends SummaryCardHeaderProps {
  key: string
  value: ReactNode
  valueDescription?: ReactNode
  footer?: ReactNode
  valueClassName?: string
  contentClassName?: string
  cardClassName?: string
}

interface SummaryCardHeaderListProps {
  items: SummaryCardItem[]
  gridClassName?: string
  className?: string
}

export function SummaryCardHeaderList({
  items,
  gridClassName,
  className,
}: SummaryCardHeaderListProps) {
  if (!items.length) return null

  return (
    <div className={cn('grid gap-6', gridClassName, className)}>
      {items.map(
        ({
          key,
          cardClassName,
          contentClassName,
          value,
          valueDescription,
          valueClassName,
          footer,
          ...headerProps
        }) => (
          <Card key={key} className={cardClassName}>
            <SummaryCardHeader {...headerProps} />
            <CardContent className={cn('space-y-1', contentClassName)}>
              <div className={cn('text-2xl font-bold', valueClassName)}>{value}</div>
              {valueDescription ? (
                <p className="text-xs text-muted-foreground">{valueDescription}</p>
              ) : null}
              {footer}
            </CardContent>
          </Card>
        ),
      )}
    </div>
  )
}
