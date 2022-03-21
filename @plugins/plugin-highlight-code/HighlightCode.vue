<template>
  <div ref="code" class="hl-code">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onResetUi } from "@factor/api"
import { onMounted, PropType, ref } from "vue"
import hljs from "highlight.js"
defineProps({
  theme: { type: String as PropType<"light" | "dark">, default: "light" },
})
const code = ref<HTMLElement>()

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
onMounted(() => {
  setOpacity("0")
  tryHighlight(() => setOpacity("1"))
})
</script>
<style lang="less">
@import "highlight.js/styles/agate.css";
pre code.hljs {
  padding: 1.5em;
}
</style>
