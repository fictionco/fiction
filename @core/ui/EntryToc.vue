<template>
  <div
    class="flex flex-col justify-between overflow-y-auto max-h-screen pt-0 pb-6 sticky top-32"
    @click.stop
  >
    <div ref="nav" class="mb-8">
      <div
        v-if="headers.length > 0"
        class="uppercase tracking-wide font-medium mb-3 text-xs text-slate-300"
      >
        On this page
      </div>
      <ul class="overflow-x-hidden">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="block transform transition-colors duration-200 text-slate-500 py-1.5 hover:text-primary-500 text-xs"
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
                class="block transform transition-colors duration-200 text-slate-500 py-2 hover:text-black"
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
import { throttle, toLabel } from "@factor/api"
import { useRoute } from "vue-router"
import { onBeforeUnmount, onMounted, watch, ref } from "vue"

interface PageHeaders {
  text: string
  anchor: string
  sub: { text: string; anchor: string }[]
}
export default {
  props: {
    subHeader: { type: Boolean, default: false },
    selector: { type: String, default: "" },
  },
  setup(props) {
    const route = useRoute()

    const clicked = ref(false)
    const scroller = ref()
    const headers = ref<PageHeaders[]>([])
    const allHeaders = ref<HTMLHeadingElement[]>([])
    const activeHash = ref(route.hash)
    const hydrated = ref(false)
    const loading = ref(false)

    onBeforeUnmount(() => {})

    const collectH3s = (h: HTMLHeadingElement): HTMLHeadingElement[] => {
      const h3s = []
      let next = h.nextSibling as HTMLHeadingElement
      while (next && next.tagName !== "H2") {
        if (next.tagName === "H3") {
          h3s.push(next)
        }
        next = next.nextSibling as HTMLHeadingElement
      }
      return h3s
    }

    const getHeaderText = (h: HTMLHeadingElement): string => {
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
    }

    const getHeaders = (el: HTMLElement) => {
      const out: any[] = []

      el.querySelectorAll("h2").forEach((h2: HTMLHeadingElement) => {
        allHeaders.value.push(h2)

        const sub = collectH3s(h2).map((h3: HTMLHeadingElement) => {
          allHeaders.value.push(h3)
          return {
            text: getHeaderText(h3),
            anchor: `#${h3.id}`,
          }
        })
        out.push({
          text: getHeaderText(h2),
          anchor: `#${h2.id}`,
          sub,
        })
      })
      loading.value = false
      return out
    }

    const setActiveHash = () => {
      // Disable this behavior after click actions (not actual scrolls)
      if (clicked.value || !scroller.value) {
        clicked.value = false
        return
      }

      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )

      const headers = props.subHeader ? "h2, h3" : "h2"
      const anchors = scroller.value.querySelectorAll(headers)

      for (const [i, anchor] of anchors.entries()) {
        const nextAnchor = anchors[i + 1]

        if (i === 0 && scrollTop === 0) {
          activeHash.value = ``
          return
        }

        const isActive =
          scrollTop >= anchor.offsetTop - 70 &&
          (!nextAnchor || scrollTop < nextAnchor.offsetTop - 70)

        if (
          isActive &&
          decodeURIComponent(route.hash) !== decodeURIComponent(anchor.id)
        ) {
          activeHash.value = `#${anchor.id}`

          return
        }
      }
    }

    const onScroll = () => {
      return throttle(() => {
        setActiveHash()
      }, 100)
    }

    // eslint-disable-next-line no-undef
    let __timer: NodeJS.Timeout | undefined
    const setMenu = () => {
      if (__timer) clearTimeout(__timer)

      // Make sure new content is loaded before scanning for h2, h3
      __timer = setTimeout(() => {
        scroller.value = document.querySelectorAll(props.selector)[0]

        if (scroller.value) {
          headers.value = getHeaders(scroller.value)

          window.addEventListener("scroll", onScroll())
        } else {
          setMenu()
        }
      }, 500)
    }

    let lastPath = route.path
    watch(
      () => route,
      (to, from) => {
        if (to.path != lastPath) {
          setMenu()
          lastPath = to.path
        } else if (to.hash != from.hash) {
          activeHash.value = to.hash
        }
      },
      { deep: true },
    )

    const setClick = (anchor: string): void => {
      clicked.value = true
      const el = document.querySelector(anchor) as HTMLElement

      if (el) {
        window.scroll({
          top: el.offsetTop - 120,
          left: 0,
          behavior: "smooth",
        })
      }
    }

    const isActive = (anchorName: string, anchorList?: string[]): boolean => {
      if (activeHash.value == anchorName) {
        return true
      } else if (anchorList && anchorList.includes(activeHash.value)) {
        return true
      } else {
        return false
      }
    }

    onMounted(() => {
      hydrated.value = true
      setMenu()

      if (route.hash) {
        setClick(route.hash)
      }
    })

    return { toLabel, setClick, isActive, headers }
  },
}
</script>
