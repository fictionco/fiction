import { sanitizeHtml, addFilter } from "@factor/tools"

addFilter("client-directives", _ => {
  _["formatted-text"] = function(el, binding): void {
    el.innerHTML = sanitizeHtml(binding.value)
  }
  return _
})

addFilter("server-directives", _ => {
  _["formatted-text"] = function(vnode, directiveMeta): void {
    const content = sanitizeHtml(directiveMeta.value)
    const domProps = vnode.data.domProps || (vnode.data.domProps = {})
    domProps.innerHTML = content
  }
  return _
})
