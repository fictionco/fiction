<template>
  <div class="docs-toc" @click.stop>
    <div v-if="hydrated" ref="nav" class="sidebar-inner">
      <div class="menu-title">
        <factor-icon icon="fas fa-align-left" />
        <span>Contents</span>
      </div>
      <ul class="menu-root">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="nav-link parent"
            :href="h2.anchor"
            :class="isActive(h2.anchor) ? 'scroll-active' : ''"
            @click.prevent="setClick(h2.anchor)"
            >{{ h2.text }}</a
          >
          <!--To turn this back on use condition: h2.sub && isActive(h2.anchor, h2.sub.map(h3 => h3.anchor)) -->
          <ul v-if="subHeader">
            <li v-for="(h3, ii) in h2.sub" :key="ii">
              <a
                class="nav-link sub"
                :class="isActive(h3.anchor) ? 'scroll-active' : ``"
                :href="h3.anchor"
                @click.prevent="setClick(h3.anchor)"
                >{{ h3.text }}</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { factorIcon } from "@factor/ui"
import { throttle, setting, toLabel } from "@factor/api"

import { Route } from "vue-router"

export default {
  components: { factorIcon },
  props: {
    subHeader: { type: Boolean, default: false },
    selector: { type: String, default: "" },
  },
  data() {
    return {
      scroller: null,
      headers: [],
      allHeaders: [],
      activeHash: this.$route.hash,
      hydrated: false,
    }
  },

  computed: {},
  watch: {
    $route: function (this: any, to: Route, from: Route): void {
      if (to.path != from.path) {
        this.setMenu()
      } else if (to.hash != from.hash) {
        this.activeHash = to.hash
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll())
  },
  mounted(this: any) {
    this.hydrated = true
    this.setMenu()

    if (this.$route.hash) {
      this.setClick(this.$route.hash)
    }
  },
  methods: {
    toLabel,
    setting,
    isActive(this: any, anchorName: string, anchorList?: string[]) {
      if (this.activeHash == anchorName) {
        return true
      } else if (anchorList && anchorList.includes(this.activeHash)) {
        return true
      } else {
        return false
      }
    },
    setClick(this: any, anchor: string) {
      this.clicked = true
      const el = document.querySelector(anchor) as HTMLElement

      if (el) {
        window.scroll({
          top: el.offsetTop - 100,
          left: 0,
          behavior: "smooth",
        })
      }
    },
    setMenu(this: any) {
      // Make sure new content is loaded before scanning for h2, h3
      setTimeout(() => {
        this.scroller = document.querySelectorAll(this.selector)[0]

        if (this.scroller) {
          this.headers = this.getHeaders(this.scroller)

          window.addEventListener("scroll", this.onScroll())
        }
      }, 200)
    },
    onScroll() {
      return throttle(() => {
        this.setActiveHash()
      }, 100)
    },
    setActiveHash(this: any) {
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

      const headers = this.subHeader ? "h2, h3" : "h2"
      const anchors = this.scroller.querySelectorAll(headers)

      for (const [i, anchor] of anchors.entries()) {
        const nextAnchor = anchors[i + 1]

        if (i === 0 && scrollTop === 0) {
          this.activeHash = ``
          return
        }

        const isActive =
          scrollTop >= anchor.offsetTop - 100 &&
          (!nextAnchor || scrollTop < nextAnchor.offsetTop - 100)

        if (
          isActive &&
          decodeURIComponent(this.$route.hash) !== decodeURIComponent(anchor.id)
        ) {
          this.activeHash = `#${anchor.id}`

          return
        }
      }
    },
    getHeaders(this: any, el: HTMLElement) {
      const out: any[] = []

      el.querySelectorAll("h2").forEach((h2: HTMLHeadingElement) => {
        this.allHeaders.push(h2)
        const sub = this.collectH3s(h2).map((h3: HTMLHeadingElement) => {
          this.allHeaders.push(h3)
          return {
            text: this.getHeaderText(h3),
            anchor: `#${h3.id}`,
          }
        })
        out.push({
          text: this.getHeaderText(h2),
          anchor: `#${h2.id}`,
          sub,
        })
      })
      this.loading = false
      return out
    },
    collectH3s(h: HTMLHeadingElement) {
      const h3s = []
      let next = h.nextSibling as HTMLHeadingElement
      while (next && next.tagName !== "H2") {
        if (next.tagName === "H3") {
          h3s.push(next)
        }
        next = next.nextSibling as HTMLHeadingElement
      }
      return h3s
    },
    getHeaderText(h: HTMLHeadingElement) {
      const text = [].slice
        .call(h.childNodes)
        .map((node: any): string => {
          return node.textContent?.replace("#", "") ?? ""
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
    },
  },
}
</script>

<style lang="less">
// Docs Sidebar
.docs-toc {
  position: sticky;
  top: 70px;
  padding-bottom: 5em;
  overflow: scroll;
  height: calc(~"100vh - 70px");
  color: var(--color-text-secondary, inherit);
  font-size: 12px;
  font-weight: 600;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }

  .menu-title {
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
    font-size: 0.9em;
  }

  .sidebar-inner {
    border-left: 1px solid var(--color-border);
    padding: 1rem 0px 2rem 1.5rem;
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
      margin-top: 1rem;
      font-size: 0.8em;

      font-weight: var(--font-weight-bold);
      opacity: 0.2;
      text-transform: uppercase;
    }
    .primary-doc-link {
      font-weight: 700;
    }
    a {
      color: inherit;
      &.router-link-exact-active,
      &:hover,
      &.scroll-active {
        color: var(--color-text);
      }
      &:hover {
        //border-bottom: 2px solid var(--color-primary);
      }
    }
    //sidebar
    .nav-link {
      display: block;
      line-height: 1.3;

      padding: 0.25rem 0;
      &.sub {
        font-size: 0.9em;
        opacity: 0.8;
        margin-left: 1rem;
        padding: 4px 0;
      }
    }
  }
}
</style>
