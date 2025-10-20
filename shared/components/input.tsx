import { Input } from "@/components/ui/input"


interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export const NumberInput = ({ value, onChange, placeholder, id }: NumberInputProps) => (
  <Input
    id={id}
    type="number"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
)