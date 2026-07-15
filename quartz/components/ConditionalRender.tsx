import { h } from "preact"
import { QuartzComponent, QuartzComponentProps } from "./types"

type Condition = (props: QuartzComponentProps) => boolean

export default ((component: QuartzComponent, condition: Condition) => {
  const ConditionalRender: QuartzComponent = (props: QuartzComponentProps) => {
    if (!condition(props)) {
      return null
    }
    return h(component, props)
  }

  ConditionalRender.css = component.css
  ConditionalRender.beforeDOMLoaded = component.beforeDOMLoaded
  ConditionalRender.afterDOMLoaded = component.afterDOMLoaded

  return ConditionalRender
}) as (component: QuartzComponent, condition: Condition) => QuartzComponent
