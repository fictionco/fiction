<script>
export default {
  props: {
    pg: { type: String, default: "" },
    btn: { type: String, default: "" },
    size: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    path: { type: String, default: "" },
    event: { type: String, default: "" },
    query: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },

  render: function(createElement) {
    let path = this.path
    let text = this.$slots.default
    let el = "span"
    let attrs = {}
    let props = {}

    // Remove any 'falsy' values from query
    // https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
    // Removing empty values ensures a reduction in any potential "duplicate content" issues with the default state
    let query = this.$lodash.pickBy(this.query, this.$lodash.identity) || {}

    path = !path && query ? this.$route.path : path

    if (path.startsWith("http") || this.event) {
      el = "a"
      attrs = { href: path }
      props = []
    } else if (path) {
      el = "router-link"
      attrs = {}
      props = {
        to: { path, query }
      }
    }

    let classes = {}

    classes["factor-link"] = true

    if (this.pg) {
      classes[`link-${this.pg}`] = true
    }

    if (this.btn) {
      classes[`is-btn`] = true

      text = createElement(
        "factor-btn",
        {
          props: {
            btn: this.btn,
            disabled: this.disabled,
            size: this.size,
            loading: this.loading
          }
        },
        [text]
      )
    }

    if (this.disabled) {
      classes["disabled"] = true
    }

    if (
      this.$route.path == this.path ||
      this.$route.meta.activePath == this.path
    ) {
      classes["active-path"] = true
    }

    let on = this.event
      ? {
          click: e => {
            e.preventDefault()
            //e.stopPropagation()

            this.$events.$emit(this.event, query)

            return false
          }
        }
      : this.$listeners

    //const on = this.$listeners
    return createElement(
      el,
      {
        class: classes,
        attrs,
        props,
        on,
        nativeOn: on
      },
      [text]
    )
  }
}
</script>

<style lang="less">
.factor-link {
  &.disabled {
    cursor: not-allowed;
    pointer-events: none; // Future-proof disabling of clicks
  }
}
</style>