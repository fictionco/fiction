<script lang="ts" setup>
import { log, useService, vue, waitFor } from '@fiction/core'

const props = defineProps({
  subHeader: { type: Boolean, default: false },
  selector: { type: String, default: '' },
})

const logger = log.contextLogger('EntryToc')

const { fictionRouter } = useService()

interface PageHeaders {
  text: string
  anchor: string
  sub: { text: string, anchor: string }[]
}

const scroller = vue.ref<HTMLElement>()
const activeNavLink = vue.ref(-1)
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
  // Assuming props.subHeader is a boolean
  const headers: NodeListOf<HTMLElement> = props.subHeader
    ? document.querySelectorAll('h2, h3')
    : document.querySelectorAll('h2')

  const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.dynamic-nav a')
  const n: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.dynamic-nav')

  logger.info(`Found ${headers.length} headers and ${navLinks.length} navigation links`, n)

  // Callback function to execute when headers intersect with the viewport
  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id')

        // Highlight the corresponding navigation link
        const navArray = Array.from(navLinks)
        const ind = navArray.findIndex((link, i) => {
          return (link.getAttribute('href') === `#${id}`)
        })

        if (ind !== -1)
          activeNavLink.value = ind
      }
    })
  }

  // Setup the observer with options
  const options: IntersectionObserverInit = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1, // 10% of the element should be visible
  }

  const observer = new IntersectionObserver(callback, options)

  // Observe each header
  headers.forEach(header => observer.observe(header))
}

function setMenu(): void {
  scroller.value = document.querySelectorAll<HTMLElement>(props.selector)[0]

  if (scroller.value)
    headers.value = getHeaders(scroller.value)
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
  const el = document.querySelector(anchor) as HTMLElement

  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
  else {
    console.warn(`No element found for anchor: ${anchor}`)
  }
}

function isActive(navLinkIndex: number): boolean {
  return navLinkIndex === activeNavLink.value
}

vue.onMounted(async () => {
  hydrated.value = true
  setMenu()

  if (fictionRouter.current.value.hash)
    setClick(fictionRouter.current.value.hash)

  await waitFor(100)

  setActiveHash()
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
        class="mb-3 text-xs font-medium uppercase tracking-wide text-theme-300 dark:text-theme-600"
      >
        On this page
      </div>
      <ul class="overflow-x-hidden dynamic-nav">
        <li v-for="(h2, i) in headers" :key="i">
          <a
            class="hover:text-primary-500 dark:hover:text-primary-400 block py-2 text-xs  transition-colors duration-200"
            :href="h2.anchor"
            :class="isActive(i) ? 'font-medium text-primary-500 dark:text-primary-400' : 'text-theme-500 dark:text-theme-200'"

            @click.prevent="setClick(h2.anchor)"
          >
            {{ h2.text }}
          </a>
          <!-- To turn this back on use condition: h2.sub && isActive(h2.anchor, h2.sub.map(h3 => h3.anchor)) -->
          <!-- <ul>
            <li v-for="(h3, ii) in h2.sub" :key="ii" class="ml-4">
              <a
                class="block transform transition-colors duration-200 text-theme-500 py-2 hover:text-black"
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
