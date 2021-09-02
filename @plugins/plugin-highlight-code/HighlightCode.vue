<template>
  <div ref="code" class="hl-code">
    <slot />
  </div>
</template>

<script lang="ts">
import "./prism/prism"

declare global {
  interface Window {
    Prism: any
  }
}
import { onResetUi } from "@factor/api"
import { onMounted, PropType, ref } from "vue"
export default {
  props: {
    theme: { type: String as PropType<"light" | "dark">, default: "light" },
  },
  setup() {
    const code = ref()
    const loading = ref(true)
    const tries = ref(0)

    const setOpacity = (o: string): void => {
      if (!code.value) return
      code.value.querySelectorAll("pre").forEach((el: HTMLElement) => {
        el.classList.add("transition-opacity", "duration-75")
        el.style.opacity = o
      })
    }

    const tryHighlight = (cb?: () => void) => {
      if (!code.value) return

      setTimeout(() => {
        const prism = window.Prism
        prism.highlightAllUnder(code.value)

        if (cb) cb()
      }, 300)
    }

    onResetUi(() => tryHighlight())
    onMounted(() => {
      setOpacity("0")
      tryHighlight(() => setOpacity("1"))
    })

    return { loading, tries, code }
  },
}
</script>

<style lang="less">
:root {
  --prism-foreground: #d4d4d4;
  --prism-background: #222222;

  --prism-namespace: #ffffff;
  --prism-comment: #999;
  --prism-namespace: #e2777a;
  --prism-string: #b8b7ff;
  --prism-punctuation: #ccc;
  --prism-literal: #36acaa;
  --prism-keyword: #00e380;
  --prism-function: #6196cc;
  --prism-deleted: #d3000e;
  --prism-class: #4ec9b0;
  --prism-builtin: #d16969;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}
:root {
  --c-divider: var(--c-divider-light);

  --c-text: var(--c-text-light-1);
  --c-text-light: var(--c-text-light-2);
  --c-text-lighter: var(--c-text-light-3);

  --c-bg: var(--c-white);
  --c-bg-accent: var(--c-white-dark);

  --code-line-height: 24px;
  --code-font-size: 14px;
  --code-inline-bg-color: rgba(27, 31, 35, 0.05);
  --code-bg-color: #282c34;
}
@import "./prism/theme-dark.less";
</style>
