<script lang="ts" setup>
import { deepMerge, getColorScheme, vue } from '@fiction/core'
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardHeader from './el/CardHeader.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<CardOptionsWithStandard>>, required: true },
})

const cardWrap = vue.ref<HTMLElement | null>(null)
const loaded = vue.ref(false)
const uc = vue.computed(() => props.card.userConfig.value || {})
const siteUc = vue.computed(() => props.card.site?.fullConfig.value || {})
const standardUc = vue.computed(() => uc.value.standard)
const isLightMode = vue.computed(() => props.card.site?.isLightMode.value)
const isReversed = vue.computed(() => standardUc.value?.scheme?.reverse)
const schemeKey = vue.computed(() => (isLightMode.value && !isReversed.value) || (isReversed.value && !isLightMode.value) ? 'base' : 'light')
const colorScheme = vue.computed(() => {
  const parts = [
    siteUc.value?.standard?.scheme?.base,
    standardUc.value?.scheme?.base,
  ]

  if (isLightMode.value)
    parts.push(...[siteUc.value?.standard?.scheme?.light, standardUc.value?.scheme?.light])

  return deepMerge([...parts])
})

const containerStyle = vue.computed(() => {
  const bg = colorScheme.value?.bg
  const theme = getColorScheme(colorScheme.value?.theme || 'gray')
  const primary = getColorScheme(colorScheme.value?.primary || 'blue')

  const fonts = standardUc.value?.fontStyle || {}

  const style: Record<string, string> = {}

  // Set theme and primary color variables
  Object.entries(theme).forEach(([k, v]) => style[`--theme-${k}`] = v)
  Object.entries(primary).forEach(([k, v]) => style[`--primary-${k}`] = v)

  // Set font variables
  if (fonts.title) {
    style['--title-font-family'] = fonts.title.family || 'inherit'
    style['--title-font-weight'] = fonts.title.weight || 'bold'
  }
  if (fonts.body) {
    style['--body-font-family'] = fonts.body.family || 'inherit'
    style['--body-font-weight'] = fonts.body.weight || 'normal'
  }

  // // Set background styles
  // if (bg) {
  //   if (bg.color)
  //     style.backgroundColor = bg.color

  //   if (bg.gradient) {
  //     const stops = bg.gradient.stops || []
  //     if (stops.length === 1)
  //       stops.push({ color: bg.color || 'transparent' })
  //     style.backgroundImage = `linear-gradient(${bg.gradient.angle || 90}deg, ${stops.map(stop => `${stop.color || 'transparent'} ${stop.percent || ''}%`).join(', ')})`
  //     style.backgroundSize = '150% 150%'
  //   }

  //   if (bg.media?.format === 'url') {
  //     style.backgroundImage = `url(${bg.media.html})`
  //     style.backgroundRepeat = bg.media.repeat || 'no-repeat'
  //     style.backgroundPosition = bg.media.position || 'center'
  //     style.backgroundSize = bg.media.size || 'cover'
  //   }

  //   if (bg.media?.filters?.length) {
  //     style.filter = bg.media.filters.map(f => `${f.filter}(${f.percent}%)`).join(' ')
  //   }
  // }

  return style
})
</script>

<template>
  <div
    ref="cardWrap"
    class="relative card-wrap"
    :style="containerStyle"
    :class="[isReversed ? schemeKey : '', loaded ? 'loaded' : '']"
  >
    <div class="z-10">
      <CardHeader :card="card" />
      <slot />
    </div>
    <ElImage class="object-cover w-full h-full absolute inset-0 pointer-events-none z-0" :media="colorScheme?.bg" />
  </div>
</template>

<style lang="less" scoped>
.engine-container {
  font-family: var(--body-font-family, inherit);
  font-weight: var(--body-font-weight, normal);

  :deep(.engine-content) {
    max-width: var(--content-width, 100%);
    padding-top: var(--vertical-spacing, 0);
    padding-bottom: var(--vertical-spacing, 0);
  }
}
</style>
