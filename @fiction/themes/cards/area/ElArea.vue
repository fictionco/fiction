<script lang="ts" setup>
import { getColorScheme, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElEngine from '../CardEngine.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const isDarkMode = vue.computed(() => props.card.site?.isDarkMode.value)
const colorScheme = vue.computed(() => uc.value.scheme?.[isDarkMode.value ? 'dark' : 'light'])
const flipModeClass = vue.computed(() => uc.value?.scheme?.reverse ? (!isDarkMode.value ? 'dark' : 'light') : '')
const theme = vue.computed(() => getColorScheme(colorScheme.value?.theme || 'gray'))
const st = vue.computed(() => ({ 'background-color': colorScheme.value?.bg?.color }))
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
