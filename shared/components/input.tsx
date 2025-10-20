import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="space-y-1">
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          error && 'border-destructive focus-visible:ring-destructive/30',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  ),
)

TextInput.displayName = 'TextInput'

export default TextInput
