<template>
  <div ref="code" class="hl-code">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onResetUi, vue } from "@factor/api"
import hljs from "highlight.js"

const themes = {
  github: () => import(`highlight.js/styles/github.css`),
  agate: () => import(`highlight.js/styles/agate.css`),
  atomOneLight: () => import(`highlight.js/styles/atom-one-light.css`),
  atomOneDark: () => import(`highlight.js/styles/atom-one-dark.css`),
  vs: () => import(`highlight.js/styles/vs.css`),
}

const props = defineProps({
  theme: {
    type: String as vue.PropType<keyof typeof themes>,
    default: undefined,
  },
})
const code = vue.ref<HTMLElement>()

const setOpacity = (o: string): void => {
  if (!code.value) return
  code.value.querySelectorAll("pre").forEach((el: HTMLElement) => {
    el.classList.add("transition-opacity", "duration-75")
    el.style.opacity = o
  })
}

const tryHighlight = (cb?: () => void): void => {
  setTimeout((): void => {
    if (!code.value) return
    code.value.querySelectorAll<HTMLElement>("pre code").forEach((el) => {
      hljs.highlightElement(el)
    })

    if (cb) cb()
  }, 300)
}

onResetUi(() => tryHighlight())
vue.onMounted(async () => {
  setOpacity("0")
  const key = props.theme || "github"
  await themes[key]()

  tryHighlight(() => setOpacity("1"))
})
</script>
<style lang="less">
pre code.hljs {
  padding: 1.5em;
}
</style>
