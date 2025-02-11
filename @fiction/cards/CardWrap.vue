<script lang="ts" setup>
import type { Card } from '@fiction/site/index.js'
import type { CardOptionsWithStandard } from '@fiction/site/schema'
import { getColorScheme, vue } from '@fiction/core'
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
const isReversed = vue.computed(() => standardUc.value?.invertColorScheme)
const isLightMode = vue.computed(() => {
  const siteLightMode = props.card.site?.isLightMode.value
  return (siteLightMode && !isReversed.value) || (!siteLightMode && isReversed.value)
})

const colorScheme = vue.computed(() => {
  const siteStandard = siteUc.value?.standard || {}
  const cardStandard = standardUc.value || {}

  const siteBackground = siteStandard?.[isLightMode.value ? 'backgroundAlt' : 'background'] ?? siteStandard?.background
  const sitePrimaryColor = siteStandard?.[isLightMode.value ? 'primaryColorAlt' : 'primaryColor'] ?? siteStandard?.primaryColor
  const siteThemeColor = siteStandard?.[isLightMode.value ? 'themeColorAlt' : 'themeColor'] ?? siteStandard?.themeColor

  const cardBackground = cardStandard?.[isLightMode.value ? 'backgroundAlt' : 'background'] ?? cardStandard?.background
  const cardPrimaryColor = cardStandard?.[isLightMode.value ? 'primaryColorAlt' : 'primaryColor'] ?? cardStandard?.primaryColor
  const cardThemeColor = cardStandard?.[isLightMode.value ? 'themeColorAlt' : 'themeColor'] ?? cardStandard?.themeColor

  return {
    background: cardBackground || siteBackground,
    primary: cardPrimaryColor || sitePrimaryColor,
    theme: cardThemeColor || siteThemeColor,
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

const autoSetDark = vue.computed(() => {
  const baseBg = standardUc.value?.background
  const lightBg = standardUc.value?.backgroundAlt
  return baseBg && !lightBg
})

const editDropdownVisible = vue.ref(false)

const editDropdownItems = vue.computed(() => {
  const items = [
    { value: 'edit', icon: 'icon-edit' },
    { label: 'Add/Move', value: 'add', icon: 'icon-plus' },
    { value: 'delete', icon: 'icon-delete' },
  ] as const

  return items
})

function handleEditDropdownClick(item: { value: 'delete' | 'edit' | 'add' }) {
  const action = item.value
  const card = props.card
  editDropdownVisible.value = false
  card?.site?.setActiveCard({ cardId: card.cardId, action })
}
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
    :data-font-title="standardUc?.fonts?.title?.family"
    :data-font-body="standardUc?.fonts?.body?.family"
    :data-card-depth="card.depth.value"
    :data-primary-scheme="colorScheme?.primary"
    :data-theme-scheme="colorScheme?.theme"
    :data-space-size="card.fullConfig.value?.standard?.spaceSize"
    @mouseleave="editDropdownVisible = false"
  >
    <div class="w-full relative text-theme-950 dark:text-theme-50 x-font-body ">
      <div>
        <div class="relative">
          <div
            v-if="standardUc?.headers?.title"
            class="mb-8 lg:mb-16"
            :class="[card.classes.value.contentWidth]"
            data-standard-header
          >
            <StandardHeader v-if="standardUc?.headers?.title" :card />
          </div>
          <slot />

          <component
            :is="effectCard.tpl.value?.settings?.el"
            v-for="(effectCard, ii) in card.effects.value"
            :key="ii"
            data-effect-card="true"
            :data-card-id="effectCard.cardId"
            :card="effectCard"
          />
        </div>
      </div>
    </div>
    <div
      v-if="props.card?.site?.isEditable.value"
      class="z-40 opacity-0 group-hover/engine:opacity-100 transition-all bg-blue-500 dark:bg-blue-600/60 dark:hover:bg-blue-600/80 hover:z-20 cursor-pointer py-[1px] px-1.5 text-blue-100 font-sans text-[10px] absolute top-0 flex gap-0.5 items-center justify-center "
      :class="card.tpl.value?.settings.isContainer ? 'left-0' : 'right-0'"
      @click.stop="editDropdownVisible = !editDropdownVisible"
    >
      <div :class="card.tpl.value?.settings.icon" />
      <div>{{ card.tpl.value?.settings.title }}</div>
      <div
        v-if="editDropdownVisible"
        class="dd absolute top-full w-full bg-blue-500 dark:bg-blue-600/60"
      >
        <div
          v-for="(item, i) in editDropdownItems"
          :key="i"
          class="py-1 px-1.5 hover:bg-blue-600 dark:hover:bg-blue-700 capitalize cursor-pointer"
          @click.stop="handleEditDropdownClick(item)"
        >
          {{ item.value }}
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
