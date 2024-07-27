<script lang="ts" setup>
import { deepMerge, getColorScheme, vue } from '@fiction/core'
import type { Card } from '@fiction/site/index.js'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import type { CardOptionsWithStandard, SizeBasic } from '@fiction/site/schema'
import ElImage from '@fiction/ui/media/ElImage.vue'
import { getContentWidthClass, getSpacingClass } from '@fiction/site/styling'
import StandardHeader from './el/StandardHeader.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<CardOptionsWithStandard>>, required: true },
  baseSpacing: { type: String as vue.PropType<SizeBasic>, default: undefined },
  baseContentWidth: { type: String as vue.PropType<SizeBasic>, default: undefined },
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
  if (fonts.title?.fontKey) {
    style['--font-family-title'] = fontFamilyByKey(fonts.title?.fontKey)
  }
  if (fonts.title?.weight) {
    style['--font-weight-title'] = fonts.title.weight
  }
  if (fonts.body?.fontKey) {
    style['--font-family-body'] = fontFamilyByKey(fonts.body?.fontKey)
  }
  if (fonts.body?.weight) {
    style['--font-weight-body'] = fonts.body.weight
  }

  return style
})

const spacingSize = vue.computed(() => {
  const conf = config.value
  const verticalSpacing = conf.standard?.spacing?.verticalSpacing || props.baseSpacing || siteUc.value?.standard?.spacing?.verticalSpacing || 'md'

  return verticalSpacing
})

const spacing = vue.computed(() => {
  const size = spacingSize.value
  return [getSpacingClass({ size, direction: 'both' })].join(' ')
})

const contentWidthSize = vue.computed(() => {
  const conf = config.value
  const contentWidthSize = conf.standard?.spacing?.contentWidth || props.baseSpacing || siteUc.value?.standard?.spacing?.contentWidth || 'md'

  return contentWidthSize
})

const padSize = vue.computed(() => {
  const size = contentWidthSize.value
  return config.value.standard?.spacing?.contentPad || (size === 'none' ? 'none' : (props.card.depth.value <= 1 ? 'md' : 'none'))
})

const contentWidthClass = vue.computed(() => {
  const size = contentWidthSize.value
  return getContentWidthClass({ size, padSize: padSize.value })
})

vue.watch(() => standardUc.value?.fontStyle, (fontStyle) => {
  let addFonts = {}

  const site = props.card.site
  Object.entries(fontStyle || {}).forEach(([_key, f]) => {
    const fontKey = f?.fontKey

    if (fontKey && site && !site.userFonts.value[fontKey]) {
      const fontObject = { [fontKey]: { fontKey, stack: 'sans' as const } }
      addFonts = { ...addFonts, ...fontObject }
    }
  })

  if (site) {
    site.userFonts.value = { ...site.userFonts.value, ...addFonts }
  }
}, { immediate: true })
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="relative card-wrap "
    :style="containerStyle"
    :class="[
      spacing,
      isReversed ? (isLightMode ? 'light' : 'dark') : '',
      loaded ? 'loaded' : '',
      card.depth.value <= 1 ? `overflow-x-clip` : '',
    ]"
    :data-font-title="standardUc?.fontStyle?.title?.fontKey"
    :data-font-body="standardUc?.fontStyle?.body?.fontKey"
    :data-spacing-size="spacingSize"
    :data-card-depth="card.depth.value"
    :data-content-width-size="contentWidthSize"
    :data-pad-size="padSize"
  >
    <div class="w-full relative text-theme-950 dark:text-theme-50 x-font-body ">
      <div :class="contentWidthClass">
        <div class="relative">
          <StandardHeader v-if="standardUc?.headers?.title" :card class="mb-8 lg:mb-16" />
          <slot />
        </div>
      </div>
      <slot name="wrap" />
    </div>
    <ElImage v-if="colorScheme?.bg" class="object-cover w-full h-full absolute inset-0 pointer-events-none -z-10" :media="colorScheme?.bg" />
  </div>
</template>
