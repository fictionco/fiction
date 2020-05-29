import { sanitizeHtml, addFilter } from "@factor/api"
import { VNode } from "vue"

interface DirectiveMeta {
  value: string
}

const key = "formattedText"

addFilter({
  key,
  hook: "client-directives",
  callback: (
    _: Record<string, (vnode: HTMLElement, directiveMeta: DirectiveMeta) => void>
  ) => {
    _["formatted-text"] = function (el, binding): void {
      el.innerHTML = sanitizeHtml(binding.value)
    }
    return _
  },
})

addFilter({
  key,
  hook: "server-directives",
  callback: (_: Record<string, (vnode: VNode, directiveMeta: DirectiveMeta) => void>) => {
    _["formatted-text"] = function (vnode, directiveMeta): void {
      if (!vnode.data) return
      const content = sanitizeHtml(directiveMeta.value)
      const domProps = vnode.data.domProps || (vnode.data.domProps = {})
      domProps.innerHTML = content
    }
    return _
  },
})
