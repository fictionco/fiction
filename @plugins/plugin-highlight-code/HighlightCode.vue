<template>
  <div class="hl-code" ref="code" :class="loading ? 'opacity-0' : ''">
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
import { onEvent } from "@factor/api"
import { onMounted, PropType, ref } from "vue"
export default {
  props: {
    theme: { type: String as PropType<"light" | "dark">, default: "light" },
  },
  setup() {
    const code = ref()
    const loading = ref(true)
    const tries = ref(0)

    const tryHighlight = () => {
      if (!code.value) return

      const prism = window.Prism

      prism.highlightAllUnder(code.value)
    }

    onEvent("highlightSyntax", () => tryHighlight())

    onMounted(() => {
      setTimeout(() => {
        loading.value = false
        tryHighlight()
      }, 300)
    })
    return { loading, tries, code }
  },
}
</script>

<style lang="less">
:root {
  --prism-foreground: #393a34;
  --prism-background: #f8fafc;

  --prism-comment: #d1dce5;
  --prism-namespace: #444444;
  --prism-string: #10b981;
  --prism-punctuation: #8ba8bf;
  --prism-literal: #ef4444;
  --prism-keyword: #5233ff;
  --prism-function: #d97706;
  --prism-deleted: #ec4899;
  --prism-class: #2b91af;
  --prism-builtin: #ec4899;
  --prism-property: #536573;
  --prism-regex: #ec4899;
}
@import "https://cdn.jsdelivr.net/npm/prism-theme-vars/base.css";
</style>
