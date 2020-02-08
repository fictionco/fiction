<script lang="ts">
import Vue, { CreateElement, VNode } from "vue"
import { factorBtn, factorBtnDashboard } from "@factor/ui"
import { pickBy, isEmpty, emitEvent, identity } from "@factor/api"
import { applyFilters } from "@factor/api/hooks"
export default Vue.extend({
  props: {
    btn: { type: String, default: "" },
    size: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    path: { type: String, default: "" },
    event: { type: String, default: "" },
    query: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    text: { type: String, default: "" }
  },

  render: function(createElement: CreateElement): VNode {
    let path = this.path
    let text = this.text || this.$slots.default
    let el = "span"
    let attrs = {}
    let props = {}

    // Remove any 'falsy' values from query
    // https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
    // Removing empty values ensures a reduction in any potential "duplicate content" issues with the default state

    const query = pickBy(this.query, identity) || {}

    path = !path && !isEmpty(query) ? this.$route.path : path

    // Allow for global customization
    path = applyFilters("link-path", path.trim(), { query })

    const schemes = ["http:", "https:", "ftp:", "mailto:", "file:", "data:", "irc:"]

    if (schemes.some(scheme => path.includes(scheme))) {
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

    const classes: Record<string, boolean> = {}

    classes["factor-link"] = true

    if (this.btn) {
      classes[`btn-link`] = true

      const passed = {
        btn: this.btn,
        disabled: this.disabled,
        size: this.size,
        loading: this.loading
      }

      let btnElement

      if (this.btnElement) {
        btnElement = this.btnElement
      } else if (this.$route.path.includes("dashboard")) {
        btnElement = factorBtnDashboard
      } else {
        btnElement = factorBtn
      }

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

    const on = this.event
      ? {
          click: (e: Event) => {
            e.preventDefault()

            emitEvent(this.event, query)

            return false
          }
        }
      : this.$listeners

    // Native only valid on components.
    const nativeEvents = el == "a" || el == "span" ? {} : { nativeOn: on }

    //const on = this.$listeners
    return createElement(
      el,
      {
        class: classes,
        attrs,
        props,
        on,
        ...nativeEvents
      },
      [text]
    )
  }
})
</script>

<style lang="less">
.factor-link {
  cursor: pointer;
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
