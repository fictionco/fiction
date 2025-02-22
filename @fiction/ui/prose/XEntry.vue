<script lang="ts" setup>
import type { ColorThemeUser, ColorThemeWithInvert } from '@fiction/core'
import { getColorScheme, isDarkOrLightMode, vue } from '@fiction/core'

const { theme } = defineProps<{
  theme?: ColorThemeUser
}>()

const entryEl = vue.ref<HTMLElement>()
const darkLightModeClass = vue.ref()
vue.onMounted(() => {
  if (entryEl.value) {
    const md = isDarkOrLightMode(entryEl.value)
    darkLightModeClass.value = md
  }
})

const themeColors = vue.computed(() => {
  const t = theme

  if (['primary', 'default', 'naked', 'overlay', 'theme', ''].includes(t || '')) {
    return {
      colorLight: 'var(--primary-500)',
      colorDark: 'var(--primary-400)',
    }
  }

  const themeScale = getColorScheme(t as ColorThemeWithInvert)
  return {
    colorLight: themeScale[500],
    colorDark: themeScale[400],
  }
})
</script>

<template>
  <div ref="entryEl" class="prose-entry" :class="darkLightModeClass">
    <slot />
  </div>
</template>

<style lang="less">
@import url('@fiction/ui/entry.less');

.prose-entry{
  --post-theme-light: v-bind('themeColors.colorLight');
  --post-theme-dark: v-bind('themeColors.colorDark');
}
</style>
