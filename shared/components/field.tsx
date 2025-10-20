import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

const FormField = ({ label, description, action, children }: FieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
)

export default FormField
