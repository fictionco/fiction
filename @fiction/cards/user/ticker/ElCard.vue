<script lang="ts" setup>
import type { FontFamily } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { TickerConfig, UserConfig } from './config'
import CardText from '@fiction/cards/CardText.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { getTextColorBasedOnBackground, isDarkOrLightMode, pathCheck, vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const tickerWrap = vue.ref<HTMLElement>()
const scrollTranslate = vue.ref(0)

// Font registration
vue.watch(() => uc.value.items, () => {
  const items = uc.value.items || []
  const fonts = items.map(item => item.font).filter(Boolean) as FontFamily[]

  const fontObject = fonts.reduce((acc, font) => {
    const family = font.family
    if (!family)
      return acc

    acc[family] = { stack: 'sans', ...font }
    return acc
  }, {} as Record<string, FontFamily>)

  const site = props.card.site
  if (site) {
    site.userFonts.value = { ...site.userFonts.value, ...fontObject }
  }
}, { immediate: true })

const items = vue.computed(() => {
  const conf = uc.value
  const initItems = conf.items || []
  return initItems.map(item => ({
    font: { family: 'inherit' },
    fontSize: `${conf?.fontSize || '8'}vw`,
    direction: 'left' as const,
    speed: 50,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    ...item,
  }))
})

// Smooth scroll handling
vue.onMounted(() => {
  if (!tickerWrap.value)
    return

  if (uc.value.scrollEffect) {
    const updateTransform = () => {
      if (!tickerWrap.value)
        return
      const rect = tickerWrap.value.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Calculate progress through viewport
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
      const clampedProgress = Math.max(0, Math.min(1, progress))

      // Create a smooth translation effect
      scrollTranslate.value = clampedProgress * 25
    }

    const onScroll = () => {
      window.requestAnimationFrame(updateTransform)
    }

    updateTransform() // Initial position
    window.addEventListener('scroll', onScroll, { passive: true })

    vue.onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })
  }
})

function getColorStyle(ticker: TickerConfig) {
  const bgColor = ticker.backgroundColor
  const bgColorLight = ticker.backgroundColorLight || bgColor

  if (!tickerWrap.value)
    return {}

  const isLight = isDarkOrLightMode(tickerWrap.value) === 'light'
  const backgroundColor = isLight ? bgColorLight : bgColor

  if (!backgroundColor)
    return {}

  return {
    backgroundColor,
    color: getTextColorBasedOnBackground(backgroundColor),
  }
}

function getAnimationDuration(speed?: number): string {
  if (speed === undefined)
    speed = 50
  if (speed === 0)
    return '100000s'

  speed = Math.max(0, Math.min(100, speed))
  return `${1000 * Math.exp(-0.0462 * speed)}s`
}

function getTransformStyle(item: TickerConfig) {
  const direction = item.direction === 'right' ? -1 : 1
  const translateAmount = scrollTranslate.value * direction

  const out = [`translateX(${translateAmount}%)`]

  if (item.transform?.rotateX)
    out.push(`rotateX(${item.transform.rotateX}deg)`)

  if (item.transform?.rotateY)
    out.push(`rotateY(${item.transform.rotateY}deg)`)

  if (item.transform?.rotateZ)
    out.push(`rotateZ(${item.transform.rotateZ}deg)`)

  return {
    transform: out.join(' '),
  }
}
</script>

<template>
  <div class="">
    <div ref="tickerWrap" class="x-font-title font-bold [perspective:1000px] " :style="{ perspective: '1000px' }">
      <CardLink
        v-for="(item, i) in items"
        :key="i"
        :card
        :style="{
          'fontFamily': fontFamilyByKey(item.font.family),
          'fontSize': item.fontSize,
          ...getTransformStyle(item),
          '-webkit-text-stroke-width': item.outline ? '1px' : '',
          '-webkit-text-stroke-color': item.outline ? 'inherit' : '',
          '-webkit-text-fill-color': item.outline ? 'transparent' : '',
          'line-height': '1.2',
          'transition': 'transform 0.1s linear',
        }"
        class="transition-all block"
        :class="item.href ? 'hover:opacity-80' : ''"
        :href="item.href"
        @click.stop
      >
        <div
          class="flex whitespace-nowrap"
          :class="`animate-scroll-${item.direction}`"
          :style="{ animationDuration: getAnimationDuration(item.speed) }"
        >
          <div :style="{ ...getColorStyle(item) }" class="inline-flex items-center gap-8 font-bold ">
            <template v-for="ii in 30" :key="ii">
              <CardText tag="span" :card :path="pathCheck(`items.${i}.text`, schema)" />
              <XIcon
                v-if="item.divider?.isEnabled && item.divider.icon"
                class="inline-block size-[.65em]"
                :class="item.divider.shouldRotate ? 'rotate-divider' : ''"
                :style="{
                  color: item.divider.color,
                }"
                :media="item.divider.icon"
              />
            </template>
          </div>
        </div>
      </CardLink>
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

/* Add these animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotate-divider {
  animation: spin-slow 20s linear infinite;
  transform-origin: center;
}
</style>
