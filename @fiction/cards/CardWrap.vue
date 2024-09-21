<script lang="ts" setup>
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import { deepMerge, getColorScheme, vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import XMedia from '@fiction/ui/media/XMedia.vue'
import StandardHeader from './el/StandardHeader.vue'

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
  if (colorScheme.value?.theme && colorScheme.value?.theme !== 'gray') {
    const theme = getColorScheme(colorScheme.value?.theme || 'gray')
    Object.entries(theme).forEach(([k, v]) => style[`--theme-${k}`] = v)
  }

  if (colorScheme.value?.primary && colorScheme.value?.primary !== 'primary') {
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

const autoSetDark = vue.computed(() => {
  const baseBg = standardUc.value?.scheme?.base?.bg
  const lightBg = standardUc.value?.scheme?.light?.bg
  return baseBg && !lightBg
})
</script>

<template>
  <div
    ref="cardWrap"
    :key="card.cardId"
    class="relative card-wrap "
    :style="containerStyle"
    :class="[
      card.classes.value.verticalSpacing,
      isReversed ? (isLightMode ? 'light' : 'dark') : '',
      autoSetDark ? 'dark' : '',
      loaded ? 'loaded' : '',
      card.depth.value <= 1 ? `overflow-x-clip` : '',
    ]"
    :data-card-template-id="card.templateId.value"
    :data-font-title="standardUc?.fontStyle?.title?.fontKey"
    :data-font-body="standardUc?.fontStyle?.body?.fontKey"
    :data-card-depth="card.depth.value"
    :data-primary-scheme="colorScheme?.primary"
    :data-theme-scheme="colorScheme?.theme"
  >
    <div class="w-full relative text-theme-950 dark:text-theme-50 x-font-body ">
      <div>
        <div class="relative">
          <div :class="card.classes.value.contentWidth">
            <StandardHeader v-if="standardUc?.headers?.title" :card class="mb-8 lg:mb-16" />
          </div>
          <slot />

          <component
            :is="effectCard.tpl.value?.settings?.el"
            v-for="(effectCard, ii) in card.effects.value"
            :key="ii"
            :card="effectCard"
          />
        </div>
      </div>
    </div>
    <div
      v-if="props.card?.site?.isEditable.value"
      class="opacity-0 group-hover/engine:opacity-100 transition-all bg-blue-500 dark:bg-blue-600/60 dark:hover:bg-blue-600/80 hover:z-20 cursor-pointer py-[1px] px-1.5 text-blue-100 font-sans text-[10px] absolute top-0 flex gap-0.5 items-center justify-center "
      :class="card.tpl.value?.settings.isContainer ? 'left-0' : 'right-0'"
    >
      <div :class="card.tpl.value?.settings.icon" />
      <div>{{ card.tpl.value?.settings.title }}</div>
    </div>
    <XMedia v-if="colorScheme?.bg" class="object-cover w-full h-full absolute inset-0 pointer-events-none -z-10" :media="colorScheme?.bg" />
  </div>
</template>
