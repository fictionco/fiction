<script lang="ts" setup>
import type { ColorScheme } from '@factor/api'
import { getColorScheme, vue } from '@factor/api'
import type { Card } from '../../card'
import ElEngine from '../ElEngine.vue'

export type UserConfig = {
  flipColorMode?: boolean
  lightMode?: {
    bgColor?: string
    scheme?: ColorScheme
  }
  darkMode?: {
    bgColor?: string
    scheme?: ColorScheme
  }
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const isDarkMode = vue.computed(() => props.card.site?.isDarkMode.value)
const flipModeClass = vue.computed(() => (uc.value.flipColorMode ? (!props.card.site?.isDarkMode.value ? 'dark' : 'light') : ''))
const theme = vue.computed(() => {
  const scheme = isDarkMode.value && uc.value.darkMode?.scheme ? uc.value.darkMode?.scheme : uc.value.lightMode?.scheme
  return getColorScheme(scheme || 'slate')
})

const st = vue.computed(() => {
  const bgColor = isDarkMode.value && uc.value.darkMode?.bgColor ? uc.value.darkMode?.bgColor : uc.value.lightMode?.bgColor
  return { 'background-color': bgColor }
})
</script>

<template>
  <div class="engine-container " :style="st" :class="flipModeClass">
    <ElEngine :card="card" class="text-theme-1000 dark:text-theme-0" />
  </div>
</template>

<style lang="less">
.engine-container {
  --theme-0: v-bind("theme[0]");
  --theme-25: v-bind("theme[25]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-950: v-bind("theme[950]");
  --theme-975: v-bind("theme[975]");
  --theme-1000: v-bind("theme[1000]");
}
</style>
