import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  type?: string
}

export const TextField = ({ label, value, onChange, placeholder, id, type }: TextFieldProps) => (
  <LabeledField label={label} htmlFor={id}>
    <Input id={id} placeholder={placeholder} value={value} type={type} onChange={(e) => onChange(e.target.value)} />
  </LabeledField>
)

interface DynamicFieldProps {
  label: string
  children: React.ReactNode
}

export const DynamicField = ({ label, children }: DynamicFieldProps) => (
  <LabeledField label={label}>{children}</LabeledField>
)

interface LabeledFieldProps {
  label: string
  htmlFor?: string
  children: React.ReactNode
}

export const LabeledField = ({ label, htmlFor, children }: LabeledFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
  </div>
)

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
}

export function SelectField<T extends string>({ label, value, onChange, options, placeholder }: SelectFieldProps<T>) {
  return (
    <LabeledField label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "선택하세요"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </LabeledField>
  )
}
