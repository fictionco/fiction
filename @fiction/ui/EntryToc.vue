<script lang="ts" setup>
import { throttle, useService, vue } from '@fiction/core'

const props = defineProps({
  subHeader: { type: Boolean, default: false },
  selector: { type: String, default: '' },
})

const { fictionRouter } = useService()

interface PageHeaders {
  text: string
  anchor: string
  sub: { text: string, anchor: string }[]
}
const clicked = vue.ref(false)
const scroller = vue.ref<HTMLElement>()
const headers = vue.ref<PageHeaders[]>([])
const allHeaders = vue.ref<HTMLHeadingElement[]>([])
const activeHash = vue.computed({
  get: () => fictionRouter.current.value.hash,
  set: v => fictionRouter.push({ ...fictionRouter.current.value, hash: v }),
})
const hydrated = vue.ref(false)
const loading = vue.ref(false)

function collectH3s(h: HTMLHeadingElement): HTMLHeadingElement[] {
  const h3s = []
  let next = h.nextSibling as HTMLHeadingElement
  while (next && next.tagName !== 'H2') {
    if (next.tagName === 'H3')
      h3s.push(next)

    next = next.nextSibling as HTMLHeadingElement
  }
  return h3s
}

function getHeaderText(h: HTMLHeadingElement): string {
  const text = Array.prototype.slice
    .call(h.childNodes)
    .map((node: HTMLElement): string => {
      return node.textContent?.replace('#', '') ?? ''
      // if (node.nodeType === Node.TEXT_NODE) {
      //   return node.nodeValue
      // } else if (["CODE", "SPAN"].includes(node.tagName)) {
      //   return node.textContent
      // } else {
      //   return ""
      // }
    })
    .join('')

  return text
}
interface HeaderDetail {
  text: string
  anchor: string
  sub: { text: string, anchor: string }[]
}
function getHeaders(el: HTMLElement): HeaderDetail[] {
  const out: HeaderDetail[] = []

  el.querySelectorAll('h2').forEach((h2: HTMLHeadingElement) => {
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

function setActiveHash(): void {
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

  const headers = props.subHeader ? 'h2, h3' : 'h2'

  const anchorEls = scroller.value.querySelectorAll<HTMLElement>(headers)
  const anchors = Array.prototype.slice.call(anchorEls) as HTMLElement[]

  for (const entry of anchors.entries()) {
    const [i, anchor] = entry
    const nextAnchor = anchors[i + 1]

    if (i === 0 && scrollTop === 0) {
      activeHash.value = ``
      return
    }

    const isActive
      = scrollTop >= anchor.offsetTop - 70
      && (!nextAnchor || scrollTop < nextAnchor.offsetTop - 70)

    if (
      isActive
      && decodeURIComponent(fictionRouter.current.value.hash) !== decodeURIComponent(anchor.id)
    ) {
      activeHash.value = `#${anchor.id}`

      return
    }
  }
}

function onScroll(): (() => void) {
  return throttle(() => {
    setActiveHash()
  }, 100)
}

let __timer: NodeJS.Timeout | undefined
function setMenu(): void {
  if (__timer)
    clearTimeout(__timer)

  // Make sure new content is loaded before scanning for h2, h3
  __timer = setTimeout(() => {
    scroller.value = document.querySelectorAll<HTMLElement>(props.selector)[0]

    if (scroller.value) {
      headers.value = getHeaders(scroller.value)

      window.addEventListener('scroll', onScroll())
    }
    else {
      setMenu()
    }
  }, 500)
}

let lastPath = fictionRouter.current.value.path
vue.watch(
  () => fictionRouter.current.value,
  (to, from) => {
    if (to.path !== lastPath) {
      setMenu()
      lastPath = to.path
    }
    else if (to.hash !== from.hash) {
      activeHash.value = to.hash
    }
  },
  { deep: true },
)

function setClick(anchor: string): void {
  clicked.value = true
  const el = document.querySelector(anchor) as HTMLElement

  if (el) {
    window.scroll({
      top: el.offsetTop - 120,
      left: 0,
      behavior: 'smooth',
    })
  }
}

function isActive(anchorName: string, anchorList?: string[]): boolean {
  if (activeHash.value === anchorName)
    return true
  else if (anchorList && anchorList.includes(activeHash.value))
    return true
  else
    return false
}

vue.onMounted(() => {
  hydrated.value = true
  setMenu()

  if (fictionRouter.current.value.hash)
    setClick(fictionRouter.current.value.hash)
})
</script>

<template>
  <div
    class="sticky top-16 flex max-h-screen flex-col justify-between overflow-y-auto pb-6 pt-0 font-sans"
    @click.stop
  >
    <div class="mb-8">
      <div
        v-if="headers.length > 0"
        class="mb-3 text-xs font-medium uppercase tracking-wide text-slate-300"
      >
        On this page
      </div>
      <ul class="overflow-x-hidden">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="hover:text-primary-500 block py-2 text-xs text-slate-500 transition-colors duration-200"
            :href="h2.anchor"
            :class="isActive(h2.anchor) ? 'font-medium' : ''"
            @click.prevent="setClick(h2.anchor)"
          >
            {{ h2.text }}
          </a>
          <!-- To turn this back on use condition: h2.sub && isActive(h2.anchor, h2.sub.map(h3 => h3.anchor)) -->
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
