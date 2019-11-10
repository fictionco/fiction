<script>
import { pickBy, isEmpty, emitEvent, identity } from "@factor/tools"
export default {
  props: {
    btn: { type: String, default: "" },
    btnElement: { type: String, default: "" },
    size: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    path: { type: String, default: "" },
    event: { type: String, default: "" },
    query: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    text: { type: String, default: "" }
  },

  render: function(createElement) {
    let path = this.path
    let text = this.text || this.$slots.default
    let el = "span"
    let attrs = {}
    let props = {}

    // Remove any 'falsy' values from query
    // https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
    // Removing empty values ensures a reduction in any potential "duplicate content" issues with the default state

    let query = pickBy(this.query, identity) || {}

    path = !path && !isEmpty(query) ? this.$route.path : path

    path = path.trim()

    const schemes = ["http:", "https:", "ftp:", "mailto:", "file:", "data:", "irc:"]

    if (schemes.some(scheme => path.includes(scheme)) || this.event) {
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

    if (this.btn) {
      classes[`btn-link`] = true

      const passed = {
        btn: this.btn,
        disabled: this.disabled,
        size: this.size,
        loading: this.loading
      }

      const btnElement = this.btnElement
        ? this.btnElement
        : (this.$route.path.includes("dashboard")
        ? "factor-btn-dashboard"
        : "factor-btn")

      text = createElement(
        btnElement,
        {
          props: passed,
          attrs: passed
        },
        [text]
      )
    }

    if (this.disabled) {
      classes["disabled"] = true
    }

    if (this.$route.path == this.path || this.$route.meta.activePath == this.path) {
      classes["active-path"] = true
    }

    let on = this.event
      ? {
          click: e => {
            e.preventDefault()

            emitEvent(this.event, query)

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
  &.btn-link {
    color: inherit;
    display: inline-block;
    line-height: 1;
  }
}
</style>
