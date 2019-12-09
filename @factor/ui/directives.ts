import { sanitizeHtml, addFilter } from "@factor/api"
import { VNode } from "vue"

interface DirectiveMeta {
  value: string;
}

const key = "formattedText"

addFilter({
  key,
  hook: "client-directives",
  callback: (_: Record<string, Function>) => {
    _["formatted-text"] = function(el: HTMLElement, binding: DirectiveMeta): void {
      el.innerHTML = sanitizeHtml(binding.value)
    }
    return _
  }
})

addFilter({
  key,
  hook: "server-directives",
  callback: (_: Record<string, Function>) => {
    _["formatted-text"] = function(vnode: VNode, directiveMeta: DirectiveMeta): void {
      if (!vnode.data) return
      const content = sanitizeHtml(directiveMeta.value)
      const domProps = vnode.data.domProps || (vnode.data.domProps = {})
      domProps.innerHTML = content
    }
    return _
  }
})
