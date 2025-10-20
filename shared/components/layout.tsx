import type { ReactNode } from 'react'

interface StackProps {
  gap?: string
  children: ReactNode
}

export const Stack = ({ gap = 'gap-4', children }: StackProps) => (
  <div className={`flex flex-col ${gap}`}>{children}</div>
)

interface GridProps {
  columns?: string
  gap?: string
  children: ReactNode
}

export const Grid = ({ columns = 'grid-cols-2', gap = 'gap-4', children }: GridProps) => (
  <div className={`grid ${columns} ${gap}`}>{children}</div>
)
