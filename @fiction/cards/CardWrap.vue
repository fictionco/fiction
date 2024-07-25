<script lang="ts" setup>
import { deepMerge, getColorScheme, vue } from '@fiction/core'
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import ElImage from '@fiction/ui/media/ElImage.vue'
import { getSpacingClass } from '@fiction/site/styling'
import CardHeader from './el/CardHeader.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<CardOptionsWithStandard>>, required: true },
})

const cardWrap = vue.ref<HTMLElement | null>(null)
const loaded = vue.ref(false)
const config = vue.computed(() => props.card.config.value || {})
const siteUc = vue.computed(() => props.card.site?.fullConfig.value || {})
const standardUc = vue.computed(() => config.value.standard)
const isReversed = vue.computed(() => standardUc.value?.scheme?.reverse)
const isLightMode = vue.computed(() => {
  const siteLightMode = props.card.site?.isLightMode.value
  return (siteLightMode && !isReversed.value) || (!siteLightMode && isReversed.value)
})

const schemeKey = vue.computed(() => isLightMode.value ? 'light' : 'dark')

const colorScheme = vue.computed(() => {
  const parts = [siteUc.value?.standard?.scheme?.base, standardUc.value?.scheme?.base]

  if (isLightMode.value)
    parts.push(...[siteUc.value?.standard?.scheme?.light, standardUc.value?.scheme?.light])

  return deepMerge([...parts])
})

const containerStyle = vue.computed(() => {
  const fonts = standardUc.value?.fontStyle || {}

  const style: Record<string, string> = {}

  // Set theme and primary color variables
  if (colorScheme.value?.theme) {
    const theme = getColorScheme(colorScheme.value?.theme || 'gray')
    Object.entries(theme).forEach(([k, v]) => style[`--theme-${k}`] = v)
  }

  if (colorScheme.value?.primary) {
    const primary = getColorScheme(colorScheme.value?.primary || 'blue')
    Object.entries(primary).forEach(([k, v]) => style[`--primary-${k}`] = v)
  }

  // Set font variables
  if (fonts.title?.family) {
    style['--title-font-family'] = fonts.title.family
  }
  if (fonts.body?.family) {
    style['--body-font-family'] = fonts.body.family
  }

  return style
})

const spacingSize = vue.computed(() => {
  const conf = config.value
  const verticalSpacing = conf.standard?.spacing?.verticalSpacing || siteUc.value?.standard?.spacing?.verticalSpacing || 'md'

  return verticalSpacing
})

const spacing = vue.computed(() => {
  const size = spacingSize.value
  return [getSpacingClass({ size, direction: 'both' })].join(' ')
})
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="relative card-wrap"
    :style="containerStyle"
    :class="[spacing, isReversed ? (isLightMode ? 'light' : 'dark') : '', loaded ? 'loaded' : '']"
    :data-font-title="standardUc?.fontStyle?.title?.family"
    :data-font-body="standardUc?.fontStyle?.body?.family"
    :data-spacing-size="spacingSize"
  >
    <div class="z-10 relative text-theme-950 dark:text-theme-50">
      <slot />
    </div>
    <ElImage v-if="colorScheme?.bg" class="object-cover w-full h-full absolute inset-0 pointer-events-none z-0" :media="colorScheme?.bg" />
  </div>
</template>
