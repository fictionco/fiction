<template>
  <div
    class="github-actions transition-opacity opacity-0"
    :class="loaded == true ? 'opacity-100' : 'opacity-0'"
  />
</template>
<script lang="ts">
import { onMounted, ref } from "vue"
export default {
  props: {
    text: { type: String, default: "Follow Project" },
  },
  setup() {
    const loaded = ref(false)

    onMounted(async () => {
      const { render } = await import("github-buttons")
      loaded.value = true
      render(
        {
          href: "https://github.com/fiction-com/factor",
          "aria-label": "Star fiction-com/factor on GitHub",
          title: "Follow Factor 7",
          "data-icon": "octicon-star",
          "data-color-scheme":
            "no-preference: light; light: light; dark: light;",
          "data-size": "large",
          "data-show-count": true,
          "data-text": "Follow Project",
        },
        function (el) {
          document.querySelector(".github-actions")?.append(el)
        },
      )
    })
    return { loaded }
  },
}
</script>
<style lang="less">
.github-actions {
  span {
    display: flex;
  }
}
</style>
