<template>
  <div
    class="
      flex flex-col
      justify-between
      overflow-y-auto
      max-h-screen
      pt-10
      pb-6
      sticky
      top-20
    "
    @click.stop
  >
    <div v-if="hydrated" ref="nav" class="mb-8">
      <div
        v-if="headers != ''"
        class="
          uppercase
          tracking-wide
          font-medium
          mb-3
          text-xs text-bluegray-300
        "
      >
        On this page
      </div>
      <ul class="overflow-x-hidden">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="
              block
              transform
              transition-colors
              duration-200
              text-bluegray-500
              py-1.5
              hover:text-primary-500
              text-xs
            "
            :href="h2.anchor"
            :class="isActive(h2.anchor) ? 'font-medium' : ''"
            @click.prevent="setClick(h2.anchor)"
          >
            {{ h2.text }}
          </a>
          <!--To turn this back on use condition: h2.sub && isActive(h2.anchor, h2.sub.map(h3 => h3.anchor)) -->
          <!-- <ul>
            <li v-for="(h3, ii) in h2.sub" :key="ii" class="ml-4">
              <a
                class="block transform transition-colors duration-200 text-gray-500 py-2 hover:text-black"
                :href="h3.anchor"
                @click.prevent="setClick(h3.anchor)"
              >
                {{ h3.text }}
              </a>
            </li>
          </ul> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { setting, throttle, toLabel } from "@factor/api"
import { RouteLocationNormalized } from "vue-router"

export default {
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
  watch: {
    $route: function (
      this: any,
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
    ): void {
      if (to.path != from.path) {
        this.setMenu()
      } else if (to.hash != from.hash) {
        this.activeHash = to.hash
      }
    },
  },
  beforeUnmount() {
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
          top: el.offsetTop - 30,
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
        document.body.scrollTop,
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
          scrollTop >= anchor.offsetTop - 70 &&
          (!nextAnchor || scrollTop < nextAnchor.offsetTop - 70)

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
      const text = Array.prototype.slice
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
