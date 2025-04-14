<script lang="ts" setup>
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import { getColorScheme, vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardToolDropdown from './CardToolDropdown.vue'
import StandardHeader from './el/StandardHeader.vue'

const { card } = defineProps<{
  card: Card<CardOptionsWithStandard>
}>()

const cardWrap = vue.ref<HTMLElement | null>(null)
const loaded = vue.ref(false)
const config = vue.computed(() => card.config.value || {})
const siteUc = vue.computed(() => card.site?.fullConfig.value || {})
const standardUc = vue.computed(() => config.value.standard)

const colorScheme = vue.computed(() => {
  const siteStandard = siteUc.value?.standard || {}
  const cardStandard = standardUc.value || {}

  return {
    background: cardStandard?.background || siteStandard?.background,
    primary: cardStandard?.primaryColor || siteStandard?.primaryColor,
    theme: cardStandard?.themeColor || siteStandard?.themeColor,
  }
})

const containerStyle = vue.computed(() => {
  const fonts = standardUc.value?.fonts || {}

  const style: Record<string, string> = {}

  // Set theme and primary color variables
  if (colorScheme.value?.theme && colorScheme.value?.theme !== 'gray') {
    const theme = getColorScheme(colorScheme.value?.theme || 'gray')
    Object.entries(theme).forEach(([k, v]) => style[`--theme-${k}`] = v)
  }

  if (colorScheme.value?.primary && colorScheme.value?.primary !== 'primary') {
    const primary = getColorScheme(colorScheme.value?.primary || 'blue')
    Object.entries(primary).forEach(([k, v]) => style[`--primary-${k}`] = v)
  }

  // Set font variables
  if (fonts.title?.family) {
    style['--font-family-title'] = fontFamilyByKey(fonts.title?.family)
  }
  if (fonts.title?.weight) {
    style['--font-weight-title'] = fonts.title.weight
  }
  if (fonts.body?.family) {
    style['--font-family-body'] = fontFamilyByKey(fonts.body?.family)
  }
  if (fonts.body?.weight) {
    style['--font-weight-body'] = fonts.body.weight
  }

  return style
})

vue.watch(() => standardUc.value?.fonts, (fontStyle) => {
  let addFonts = {}

  const site = card.site
  Object.entries(fontStyle || {}).forEach(([_key, f]) => {
    const family = f?.family

    if (family && site && !site.userFonts.value[family]) {
      const fontObject = { [family]: { family, stack: 'sans' as const } }
      addFonts = { ...addFonts, ...fontObject }
    }
  })

  if (site) {
    site.userFonts.value = { ...site.userFonts.value, ...addFonts }
  }
}, { immediate: true })
const isEditable = vue.computed(() => card?.site?.isEditable.value)
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="card-wrap relative w-full"
    :style="containerStyle"
    :class="[
      card.classes.value.verticalSpacing,
      loaded ? 'loaded' : '',
      card.depth.value <= 1 ? `overflow-x-clip` : '',

    ]"
    :data-card-template-id="card.templateId.value"
    :data-font-title="standardUc?.fonts?.title?.family"
    :data-font-body="standardUc?.fonts?.body?.family"
    :data-card-depth="card.depth.value"
    :data-primary-scheme="colorScheme?.primary"
    :data-theme-scheme="colorScheme?.theme"
    :data-space-size="card.fullConfig.value?.standard?.spaceSize"
  >
    <div class="w-full relative text-theme-950 dark:text-theme-50 x-font-body ">
      <div>
        <div class="relative">
          <div
            v-if="standardUc?.headers?.title && !card?.site?.currentItemId.value"
            class="mb-8 lg:mb-16"
            :class="[card.classes.value.contentWidth]"
            data-standard-header
          >
            <StandardHeader v-if="standardUc?.headers?.title" :card />
          </div>
          <slot />
        </div>
      </div>
    </div>

    <XMedia
      v-if="colorScheme?.background"
      class="object-cover w-full h-full absolute inset-0 pointer-events-none -z-10"
      :media="colorScheme?.background"
    />
  </div>
</template>
