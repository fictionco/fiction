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
const uc = vue.computed(() => props.card.userConfig.value || {})
const siteUc = vue.computed(() => props.card.site?.fullConfig.value || {})
const standardUc = vue.computed(() => uc.value.standard)
const isLightMode = vue.computed(() => props.card.site?.isLightMode.value)
const isReversed = vue.computed(() => standardUc.value?.scheme?.reverse)
const schemeKey = vue.computed(() => (isLightMode.value && !isReversed.value) || (isReversed.value && !isLightMode.value) ? 'base' : 'light')
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
    style['--title-font-weight'] = fonts.title.weight || '500'
  }
  if (fonts.body?.family) {
    style['--body-font-family'] = fonts.body.family
    style['--body-font-weight'] = fonts.body.weight || '500'
  }

  return style
})

const spacing = vue.computed(() => {
  const uc = props.card?.userConfig.value || {}
  const verticalSpacing = uc.standard?.spacing?.verticalSpacing || siteUc.value?.standard?.spacing?.verticalSpacing || 'md'

  return [getSpacingClass({ size: verticalSpacing, direction: 'both' })].join(' ')
})
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="relative card-wrap"
    :style="containerStyle"
    :class="[spacing, isReversed ? schemeKey : '', loaded ? 'loaded' : '']"
  >
    <div class="z-10">
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
