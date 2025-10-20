import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CycleSelectProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

const CycleSelect = ({ value, onChange, options }: CycleSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue placeholder="주기 선택" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export { CycleSelect }