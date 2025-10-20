import { useState } from "react"

export interface AsyncUIProps {
    isProcessing?: boolean
    error?: string | null
    setup: () => void
    teardown: () => void
}

const withProcessing = <T extends Object>(
    Component: React.FC<T & AsyncUIProps>,
) => (props: T) => {

    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setup = () => setIsProcessing(true)
    const teardown = () => setIsProcessing(false)

    return (
        <Component
            {...props}
            error={error}
            isProcessing={isProcessing}
            setup={() => setup()}
            teardown={() => teardown()}
        ></Component>
    )
}

export default withProcessing