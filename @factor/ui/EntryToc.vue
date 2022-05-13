<template>
  <div
    class="sticky top-16 flex max-h-screen flex-col justify-between overflow-y-auto pt-0 pb-6"
    @click.stop
  >
    <div ref="nav" class="mb-8">
      <div
        v-if="headers.length > 0"
        class="mb-3 text-xs font-medium uppercase tracking-wide text-slate-300"
      >
        On this page
      </div>
      <ul class="overflow-x-hidden">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="block py-1.5 text-xs text-slate-500 transition-colors duration-200 hover:text-primary-500"
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
<script lang="ts" setup>
import { throttle, vue, vueRouter } from "@factor/api"

interface PageHeaders {
  text: string
  anchor: string
  sub: { text: string; anchor: string }[]
}
const props = defineProps({
  subHeader: { type: Boolean, default: false },
  selector: { type: String, default: "" },
})

const route = vueRouter.useRoute()

const clicked = vue.ref(false)
const scroller = vue.ref<HTMLElement>()
const headers = vue.ref<PageHeaders[]>([])
const allHeaders = vue.ref<HTMLHeadingElement[]>([])
const activeHash = vue.ref(route.hash)
const hydrated = vue.ref(false)
const loading = vue.ref(false)

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
    .map((node: HTMLElement): string => {
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
type HeaderDetail = {
  text: string
  anchor: string
  sub: { text: string; anchor: string }[]
}
const getHeaders = (el: HTMLElement): HeaderDetail[] => {
  const out: HeaderDetail[] = []

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

const setActiveHash = (): void => {
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

  const anchorEls = scroller.value.querySelectorAll<HTMLElement>(headers)
  const anchors = Array.prototype.slice.call(anchorEls) as HTMLElement[]

  for (const entry of anchors.entries()) {
    const [i, anchor] = entry
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

const onScroll = (): (() => void) => {
  return throttle(() => {
    setActiveHash()
  }, 100)
}

// eslint-disable-next-line no-undef
let __timer: NodeJS.Timeout | undefined
const setMenu = (): void => {
  if (__timer) clearTimeout(__timer)

  // Make sure new content is loaded before scanning for h2, h3
  __timer = setTimeout(() => {
    scroller.value = document.querySelectorAll<HTMLElement>(props.selector)[0]

    if (scroller.value) {
      headers.value = getHeaders(scroller.value)

      window.addEventListener("scroll", onScroll())
    } else {
      setMenu()
    }
  }, 500)
}

let lastPath = route.path
vue.watch(
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

vue.onMounted(() => {
  hydrated.value = true
  setMenu()

  if (route.hash) {
    setClick(route.hash)
  }
})
</script>
