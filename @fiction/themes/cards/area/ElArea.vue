<script lang="ts" setup>
import { getColorScheme, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useElementVisible } from '@fiction/ui/anim'
import ElEngine from '../CardEngine.vue'
import type { UserConfig } from '.'

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

const background = vue.computed(() => {
  return colorScheme.value?.bg
})

const st = vue.computed(() => {
  const bg = background.value
  let out = {}
  if (bg && bg.gradient) {
    out = {
      'background-image': `linear-gradient(${bg.gradient.angle}deg, ${bg.gradient.stops?.map(stop => `${stop.color} ${stop.percent}%`).join(', ')})`,
      'background-color': bg.color,
      'background-size': '150% 150%',
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
  <div class="engine-container" :style="st" :class="[flipModeClass, loaded ? 'loaded' : '']">
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
}
</style>
