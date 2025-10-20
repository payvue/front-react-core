import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

const SimpleSelect = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => (
  <div className="space-y-1">
    <select
      ref={ref}
      className={cn(
        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        error && 'border-destructive focus-visible:ring-destructive/30',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
))

SimpleSelect.displayName = 'SimpleSelect'

export default SimpleSelect
