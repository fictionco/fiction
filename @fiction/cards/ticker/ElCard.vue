<script lang="ts" setup>
import { getTextColorBasedOnBackground, isDarkOrLightMode, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FontConfigVal } from '@fiction/site/utils/fonts'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import type { Ticker, UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

vue.watch(() => uc.value.items, () => {
  const items = uc.value.items || []
  const fonts = items.map(item => item.font).filter(Boolean) as string[]

  const fontObject = fonts.reduce((acc, font) => {
    acc[font] = { fontKey: font, stack: 'sans' }
    return acc
  }, {} as Record<string, FontConfigVal>)

  const site = props.card.site

  if (site) {
    site.userFonts.value = { ...site.userFonts.value, ...fontObject }
  }
}, { immediate: true })

const items = vue.computed(() => {
  const conf = uc.value
  const initItems = conf.items || []
  return initItems.map(item => ({
    font: 'inherit',
    fontSize: `${conf.fontSize || '8'}vw`,
    direction: 'left',
    speed: 50,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    ...item,
  }))
})

const tickerWrap = vue.ref<HTMLElement>()

function getColorStyle(ticker: Ticker) {
  const bgColor = ticker.bgColor
  const bgColorDark = ticker.bgColorDark || bgColor

  if (!tickerWrap.value)
    return {}

  const isDark = isDarkOrLightMode(tickerWrap.value) === 'dark'

  const backgroundColor = isDark ? bgColorDark : bgColor

  if (!backgroundColor) {
    return { }
  }

  const color = getTextColorBasedOnBackground(backgroundColor)

  return {
    backgroundColor,
    color,
  }
}

function getAnimationDuration(speed?: number): string {
  if (speed === undefined) {
    speed = 50
  }

  if (speed === 0) {
    return '100000s'
  }

  if (speed < 0)
    speed = 0
  if (speed > 100)
    speed = 100

  const duration = 330 - speed * 3

  return `${duration}s`
}
</script>

<template>
  <div class=" overflow-x-clip">
    <div ref="tickerWrap" class="x-font-title font-bold [perspective:1000px] " :style="{ perspective: '1000px' }">
      <div
        v-for="(item, index) in items"
        :key="index"
        :style="{
          'fontFamily': fontFamilyByKey(item.font),
          'fontSize': item.fontSize,
          'transform': `rotateX(${item.rotateX}deg) rotateY(${item.rotateY}deg) rotateZ(${item.rotateZ}deg)`,
          '-webkit-text-stroke-width': item.outline ? '1px' : '',
          '-webkit-text-stroke-color': item.outline ? 'inherit' : '',
          '-webkit-text-fill-color': item.outline ? 'transparent' : '',
          'line-height': '1.2',
        }"
        class=""
      >
        <div
          class="flex whitespace-nowrap"
          :class="`animate-scroll-${item.direction}`"
          :style="{ animationDuration: getAnimationDuration(item.speed) }"
        >
          <div :style="{ ...getColorStyle(item as Ticker) }">
            <span class="font-bold">{{ item.text }}&nbsp;</span>
            <span v-for="i in 30" :key="i" class="font-bold">{{ item.text }}&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll-left {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(-500%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-500%); }
  100% { transform: translateX(-100%); }
}

.animate-scroll-left {
  animation: scroll-left 180s linear infinite;
}

.animate-scroll-right {
  animation: scroll-right 180s linear infinite;
}
</style>
