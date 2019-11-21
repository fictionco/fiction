<template>
  <div class="docs-sidebar" @click.stop>
    <div ref="nav" :style="{ opacity: hydrated ? 1 : 0 }" class="sidebar-inner">
      <div v-if="mode == 'mobile'" class="site-links">
        <template v-for="(item, index) in siteNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-formatted-text="item.name" />
          </factor-link>
        </template>
      </div>

      <ul class="menu-root">
        <div v-for="(item, itemIndex) in nav" :key="itemIndex" class="menu-item">
          <div v-if="item.group" class="group">{{ toLabel(item.group) }}</div>
          <li v-else class="doc-menu">
            <factor-link class="primary-doc-link" :path="item.route">
              <span v-formatted-text="item.name" />
            </factor-link>
            <div v-if="item.slug == activeDoc" class="scroll-menu">
              <li v-for="(h2, indexParent) in headers" :key="indexParent">
                <a
                  class="nav-link parent"
                  :href="h2.anchor"
                  :class="activeHash == h2.anchor ? 'scroll-active' : ''"
                  @click="clicked = true"
                >{{ h2.text }}</a>
                <ul v-if="false">
                  <li v-for="(h3, indexSub) in h2.sub" :key="indexSub">
                    <a
                      class="nav-link sub"
                      :class="
                        activeHash == h3.anchor ? 'scroll-active' : `not-${h3.anchor}`
                      "
                      :href="h3.anchor"
                      @click="clicked = true"
                    >{{ h3.text }}</a>
                  </li>
                </ul>
              </li>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import { factorLink, factorIcon } from "@factor/ui"
import { DOM, throttle, setting, toLabel } from "@factor/tools"

import { config } from "./docs-handler"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    mode: { type: String, default: "" }
  },
  data() {
    return {
      scroller: null,
      headers: [],
      allHeaders: [],
      activeHash: this.$route.hash,
      hydrated: false,
      navConfig: setting("site.nav")
    }
  },

  computed: {
    siteNav() {
      return this.navConfig.filter(item => !item.condition || item.condition())
    },
    nav() {
      return config()
    },

    activeDoc() {
      return this.$route.params.doc || ""
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.path != from.path) {
        this.setPage()
      } else if (to.hash != from.hash) {
        this.activeHash = to.hash
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll())
  },
  mounted() {
    this.hydrated = true
    this.setPage()
  },
  methods: {
    toLabel,
    setting,
    setPage() {
      // Make sure new content is loaded before scanning for h2, h3
      setTimeout(() => {
        this.scroller = DOM.find(".scroller")[0]

        if (this.scroller) {
          this.headers = this.getHeaders(this.scroller)

          window.addEventListener("scroll", this.onScroll())
        }
      }, 40)
    },
    onScroll() {
      return throttle(() => {
        this.setActiveHash()
      }, 100)
    },
    setActiveHash() {
      // Disable this behavior after click actions (not actual scrolls)
      if (this.clicked || !this.scroller) {
        this.clicked = false
        return
      }

      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )

      const anchors = this.scroller.querySelectorAll("h2")

      for (const [i, anchor] of anchors.entries()) {
        const nextAnchor = anchors[i + 1]

        const isActive =
          (i === 0 && scrollTop === 0) ||
          (scrollTop >= anchor.offsetTop + 10 &&
            (!nextAnchor || scrollTop < nextAnchor.offsetTop - 10))

        if (
          isActive &&
          decodeURIComponent(this.$route.hash) !== decodeURIComponent(anchor.id)
        ) {
          this.activeHash = `#${anchor.id}`

          return
        }
      }
    },
    getHeaders(el) {
      const out = []
      el.querySelectorAll("h2").forEach(h2 => {
        this.allHeaders.push(h2)
        const sub = this.collectH3s(h2).map(h3 => {
          this.allHeaders.push(h3)
          return {
            text: this.getHeaderText(h3),
            anchor: `#${h3.id}`
          }
        })
        out.push({
          text: this.getHeaderText(h2),
          anchor: `#${h2.id}`,
          sub
        })
      })
      this.loading = false
      return out
    },
    collectH3s(h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== "H2") {
        if (next.tagName === "H3") {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    },
    getHeaderText(h) {
      var text = [].slice
        .call(h.childNodes)
        .map(function(node) {
          return node.textContent
          // if (node.nodeType === Node.TEXT_NODE) {
          //   return node.nodeValue
          // } else if (["CODE", "SPAN"].includes(node.tagName)) {
          //   return node.textContent
          // } else {
          //   return ""
          // }
        })
        .join("")

      return text
    }
  }
})
</script>

<style lang="less">
// Docs Sidebar
.docs-sidebar {
  position: fixed;
  top: 45px;
  padding-bottom: 5em;
  overflow: scroll;
  height: calc(~"100vh - 45px");
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  .site-links {
    font-size: 1em;
    border-bottom: 1px solid #eee;
    padding-bottom: 1em;
    margin-bottom: 2em;
    a {
      margin-bottom: 0.3em;
      color: inherit;
      display: block;
      padding: 4px 0;
      .fa {
        margin-left: 5px;
        opacity: 0.3;
      }
    }
  }

  .title {
    font-size: 1.3em;
    font-weight: 800;
    margin-bottom: 1em;
  }

  .sidebar-inner {
    max-width: 300px;
    padding: 40px 20px 60px 20px;
    transition: opacity 0.3s;
  }

  ul {
    line-height: 1.6em;
    list-style: none;
    li.doc-menu {
      margin-bottom: 0.5em;
    }
  }
  // sidebar main menu
  ul.menu-root {
    padding-left: 0;
    .group {
      font-size: 0.8em;

      font-weight: var(--font-weight-bold);
      opacity: 0.2;
      text-transform: uppercase;
    }
    .primary-doc-link {
      font-weight: 700;
    }
    a {
      font-weight: 500;
      color: inherit;
      &.router-link-exact-active,
      &:hover,
      &.scroll-active {
        color: var(--color-primary);
      }
      &:hover {
        //border-bottom: 2px solid var(--color-primary);
      }
    }
    //sidebar
    .nav-link {
      font-size: 0.85em;
      margin-left: 1em;
      font-weight: 500;
      display: block;
      line-height: 1.3;
      &.sub {
        font-size: 0.9em;
        opacity: 0.8;
        margin-left: 2em;
        font-weight: 500;
        line-height: 1.3;
        padding: 4px 0;
      }
    }
    .scroll-menu {
      padding: 0.25em 0 0.5em;
      > li {
        margin: 0.5em 0;
      }
    }
  }
}
</style>
