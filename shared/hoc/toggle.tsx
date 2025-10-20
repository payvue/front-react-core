import { useState } from 'react'

interface ToggleProps {
  defaultValue?: boolean
  onToggle?: (value: boolean) => void
}

const withToggle = <Props extends object>(Component: React.ComponentType<Props & { active: boolean; onToggle: () => void }>) => {
  const Wrapped = ({ defaultValue = false, onToggle, ...props }: ToggleProps & Props) => {
    const [active, setActive] = useState(defaultValue)

    const handleToggle = () => {
      const next = !active
      setActive(next)
      onToggle?.(next)
    }

    return <Component {...(props as Props)} active={active} onToggle={handleToggle} />
  }

  Wrapped.displayName = `WithToggle(${Component.displayName ?? Component.name ?? 'Component'})`

  return Wrapped
}

export default withToggle
