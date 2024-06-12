<script lang="ts" setup>
import { getColorScheme, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site/index.js'
import { useElementVisible } from '@fiction/ui/anim/index.js'
import ElEngine from '../CardEngine.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const loaded = vue.ref(false)
const uc = vue.computed(() => props.card.userConfig.value || {})
const isDarkMode = vue.computed(() => props.card.site?.isDarkMode.value)
const isReversed = vue.computed(() => uc.value?.scheme?.reverse)
const schemeKey = vue.computed(() => (isDarkMode.value && !isReversed.value) || (isReversed.value && !isDarkMode.value) ? 'dark' : 'light')

const flipModeClass = vue.computed(() => isReversed ? schemeKey.value : '')
const colorScheme = vue.computed(() => uc.value.scheme?.[schemeKey.value])
const theme = vue.computed(() => getColorScheme(colorScheme.value?.theme || 'gray'))
const primary = vue.computed(() => getColorScheme(colorScheme.value?.primary || 'blue'))

const st = vue.computed(() => {
  const bg = colorScheme.value?.bg
  const stops = bg?.gradient?.stops || []

  if (stops?.length === 1)
    stops.push({ color: bg?.color || 'transparent' })

  let out = {}
  if (bg && bg.gradient) {
    out = {
      backgroundImage: stops.length ? `linear-gradient(${bg.gradient.angle || 90}deg, ${stops.map(stop => `${stop.color || 'transparent'}`).join(', ')})` : '',
      backgroundColor: bg.color,
      backgroundSize: '150% 150%',
    }
  }
  else {
    out = { 'background-color': bg?.color }
  }

  return out
})

vue.onMounted(() => {
  useElementVisible({ selector: `#${props.card.cardId}`, onVisible: async () => {
    await waitFor(1000)
    // animate
    loaded.value = true
  } })
})
</script>

<template>
  <div class="engine-container relative" :style="st" :class="[flipModeClass, loaded ? 'loaded' : '']">
    <ElEngine :card="card" class="text-theme-950 dark:text-theme-50" />
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
  --primary-0: v-bind("primary[0]");
  --primary-25: v-bind("primary[25]");
  --primary-50: v-bind("primary[50]");
  --primary-100: v-bind("primary[100]");
  --primary-200: v-bind("primary[200]");
  --primary-300: v-bind("primary[300]");
  --primary-400: v-bind("primary[400]");
  --primary-500: v-bind("primary[500]");
  --primary-600: v-bind("primary[600]");
  --primary-700: v-bind("primary[700]");
  --primary-800: v-bind("primary[800]");
  --primary-900: v-bind("primary[900]");
  --primary-950: v-bind("primary[950]");
  --primary-975: v-bind("primary[975]");
  --primary-1000: v-bind("primary[1000]");
}
</style>
