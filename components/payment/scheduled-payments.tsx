"use client"

import { Children, isValidElement } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReactElement, ReactNode } from "react"
import clsx from "clsx"

interface RecurrentTabProps {
  value: string
  label: string
  badge?: ReactNode
  children: ReactNode
}

interface RecurrentProps {
  defaultValue?: string
  className?: string
  children: ReactNode
  listClassName?: string
}

const RecurrentTab = ({ children }: RecurrentTabProps) => <>{children}</>

const RecurrentRoot = ({ defaultValue, className, listClassName, children }: RecurrentProps) => {
  const tabElements = Children.toArray(children).filter((child): child is ReactElement<RecurrentTabProps> => {
    return isValidElement(child)
  })

  if (tabElements.length === 0) {
    return null
  }

  const initialValue = defaultValue ?? tabElements[0].props.value

  return (
    <Tabs defaultValue={initialValue} className={clsx("space-y-6", className)}>
      <TabsList className={clsx("grid w-full grid-cols-2", listClassName)}>
        {tabElements.map((tab) => (
          <TabsTrigger key={tab.props.value} value={tab.props.value} className="flex items-center gap-2">
            <span>{tab.props.label}</span>
            {tab.props.badge}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabElements.map((tab) => (
        <TabsContent key={tab.props.value} value={tab.props.value}>
          {tab.props.children}
        </TabsContent>
      ))}
    </Tabs>
  )
}

const Recurrent = Object.assign(RecurrentRoot, { Tab: RecurrentTab })

export type { RecurrentTabProps }
export default Recurrent
