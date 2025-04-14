<script lang="ts" setup>
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import { getColorScheme, vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardToolDropdown from './CardToolDropdown.vue'
import StandardHeader from './el/StandardHeader.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<CardOptionsWithStandard>>, required: true },
})

const cardWrap = vue.ref<HTMLElement | null>(null)
const loaded = vue.ref(false)
const config = vue.computed(() => props.card.config.value || {})
const siteUc = vue.computed(() => props.card.site?.fullConfig.value || {})
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

  const site = props.card.site
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
const isEditable = vue.computed(() => props.card?.site?.isEditable.value)
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="  card-wrap dark relative w-full group/engine"
    :style="containerStyle"
    :class="[
      card.classes.value.verticalSpacing,
      loaded ? 'loaded' : '',
      card.depth.value <= 1 ? `overflow-x-clip` : '',
      card.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
      isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 dark:hover:outline-blue-600 cursor-pointer  transition-all' : '',
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
    <CardToolDropdown
      v-if="props.card?.site?.isEditable.value"
      :card="props.card"
      class="absolute top-3 opacity-40 group-hover/engine:opacity-100"
      :class="card.tpl.value?.settings.isContainer ? 'left-3' : 'right-3'"
    />
    <XMedia
      v-if="colorScheme?.background"
      class="object-cover w-full h-full absolute inset-0 pointer-events-none -z-10"
      :media="colorScheme?.background"
    />
  </div>
</template>
