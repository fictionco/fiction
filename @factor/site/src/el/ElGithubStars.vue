<template>
  <div
    class="github-actions transition-opacity"
    :class="loaded == true ? 'opacity-100' : 'opacity-0'"
  />
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"

const loaded = vue.ref(false)

defineProps({
  text: { type: String, default: "Follow Project" },
})

const renderButton = async (): Promise<void> => {
  const { render } = await import("github-buttons")

  render(
    {
      href: "https://github.com/FactorJS/factor",
      "aria-label": "Star FactorJS/factor on GitHub",
      title: "Follow Factor",
      "data-icon": "octicon-star",
      "data-color-scheme": "no-preference: light; light: light; dark: light;",
      "data-size": "large",
      "data-show-count": true,
      "data-text": "Follow Factor",
    },
    (el) => {
      const sels = document.querySelectorAll(".github-actions")
      sels.forEach(async (sel) => {
        sel.innerHTML = ""
        sel.append(el)
      })
    },
  )
  loaded.value = true
}

vue.onMounted(async () => {
  await renderButton()
})
</script>
<style lang="less">
.github-actions {
  span {
    display: flex;
  }
}
</style>
