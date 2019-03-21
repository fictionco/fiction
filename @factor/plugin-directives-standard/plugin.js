export default Factor => {
  return new class {
    constructor() {
      const that = this

      Factor.$filters.add("client-directives", _ => {
        _["formatted-text"] = function(el, binding) {
          el.innerHTML = that.sanitizeHtml(binding.value)
        }
        return _
      })

      // Used for displaying formatted text without using the "all things go" v-html directive
      // Removes risky tags using: https://www.npmjs.com/package/sanitize-html
      // Factor.directive("formatted-text", function(el, binding) {
      //   el.innerHTML = this.sanitizeHtml(binding.value)
      // })

      Factor.$filters.add("server-directives", _ => {
        _["formatted-text"] = function(vnode, directiveMeta) {
          const content = that.sanitizeHtml(directiveMeta.value)
          const domProps = vnode.data.domProps || (vnode.data.domProps = {})
          domProps.innerHTML = content
        }
        return _
      })
    }

    sanitizeHtml(html) {
      return require("sanitize-html")(html, {
        allowedTags: false,
        allowedAttributes: false
      })
    }
  }()
}
