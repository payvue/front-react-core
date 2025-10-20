import { useState } from "react"

export interface Toggable {
    isOpen: boolean
    toggle: () => void
}


const withToggle = <T extends Partial<Toggable>>(
    Component: React.FC<T>,
) => (props: T) => {
    const [show, setShow] = useState(false)

    return (
        <Component
            {...props}
            isOpen={show}
            toggle={() => setShow(show => !show)}
        ></Component>
    )
}

export default withToggle