import { useState } from 'react'

export interface AsyncUIProps {
  isProcessing: boolean
  setup: () => void
  teardown: () => void
}

const withProcessing = <Props extends object>(Component: React.ComponentType<Props & AsyncUIProps>) => {
  const Wrapped = (props: Props) => {
    const [isProcessing, setIsProcessing] = useState(false)

    const setup = () => setIsProcessing(true)
    const teardown = () => setIsProcessing(false)

    return <Component {...props} isProcessing={isProcessing} setup={setup} teardown={teardown} />
  }

  Wrapped.displayName = `WithProcessing(${Component.displayName ?? Component.name ?? 'Component'})`

  return Wrapped
}

export default withProcessing
