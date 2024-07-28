<script lang="ts" setup>
import type { ButtonDesign, ButtonFontWeight, ButtonFormat, ButtonHover, ButtonRounding, ButtonShadow, ColorThemeUser, StandardSize } from '@fiction/core'
import { getNavComponentType, shortId, vue } from '@fiction/core'
import { animateItemEnter, splitLetters } from '../anim'
import { getButtonClasses } from './util'

defineOptions({ name: 'ElButton' })

const props = defineProps<{
  icon?: string
  iconAfter?: string
  href?: string
  disabled?: boolean
  design?: ButtonDesign
  hover?: ButtonHover
  format?: ButtonFormat
  theme?: ColorThemeUser
  size?: StandardSize

  rounding?: ButtonRounding
  shadow?: ButtonShadow
  fontWeight?: ButtonFontWeight

  loading?: boolean | string
  wrapClass?: string
  animate?: boolean
  tag?: 'button' | 'div'
  isEditing?: boolean
}>()

const randomId = shortId()
const loaded = vue.ref(false)
const animateSelected = vue.ref()
function onClick() {
  if (props.animate) {
    animateSelected.value = true
    setTimeout(() => animateSelected.value = false, 1000)
  }
}

const cls = vue.computed(() => {
  return getButtonClasses(props)
})
const slots = vue.useSlots()
const hasContent = vue.computed(() => !!slots?.default?.())

const iconAdjust = vue.computed(() => {
  const size = props.size || 'md'
  const sizeAdjustments: Record<StandardSize, { mt: string, mxBefore: string, mxAfter: string }> = {
    'xxs': { mt: ' ', mxBefore: '-ml-[1px] mr-[1px]', mxAfter: '-mr-[1px] ml-[1px]' },
    'xs': { mt: ' ', mxBefore: '-ml-[1px] mr-[1px]', mxAfter: '-mr-[1px] ml-[1px]' },
    'sm': { mt: ' ', mxBefore: '-ml-[1px] mr-[1px]', mxAfter: '-mr-[1px] ml-[1px]' },
    'md': { mt: ' ', mxBefore: '-ml-[1px] mr-[1px]', mxAfter: '-mr-[1px] ml-[1px]' },
    'lg': { mt: ' ', mxBefore: '-ml-1.5 mr-1.5', mxAfter: '-mr-1 ml-1' },
    'xl': { mt: ' ', mxBefore: '-ml-1.5 mr-1.5', mxAfter: '-mr-1.5 ml-1.5' },
    '2xl': { mt: '', mxBefore: '-ml-2 mr-2', mxAfter: '-mr-2 ml-2' },
  }

  const { mt, mxBefore, mxAfter } = sizeAdjustments[size]

  return { before: hasContent ? mxBefore : 'mx-[-2px]', after: hasContent ? mxAfter : 'mx-[-2px]', both: `group-hover/button:opacity-50 transition-opacity text-[1.2em] ${mt}` }
})
const hasAnimation = vue.computed(() => !['none', 'basic', ''].includes(props.hover || '') && !props.disabled)

function loadAnimation() {
  splitLetters({ selector: `#${randomId} .txt` })
}

function doHoverAnimation() {
  if (!hasAnimation.value)
    return

  animateItemEnter({ targets: `#${randomId} .fx`, themeId: props.hover || 'fade', totalTime: 600 })
}

vue.onMounted(() => {
  vue.watch(() => hasAnimation.value, () => {
    if (hasAnimation.value)
      loadAnimation()
    else
      loaded.value = true
  }, { immediate: true })
})
</script>

<template>
  <component
    :is="getNavComponentType({ name: 'btn', href }, props.hover === 'none' ? 'div' : tag)"
    :id="randomId"
    :to="href"
    class="xbutton group/button"
    :class="[cls.buttonClasses, animateSelected && animate ? 'animate-selected' : '']"
    :href
    :data-loading="loading"
    :data-theme="theme"
    :data-size="size"
    @click="onClick()"
    @mouseenter="doHoverAnimation()"
  >
    <div
      :class="!loading ? 'translate-y-[150%] opacity-0' : ''"
      class="absolute left-0 flex w-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
    >
      <svg
        class="h-4 w-4"
        :class="loading ? 'animate-spin' : ''"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <span
      class="flex w-full min-w-0 items-center whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
      :class="[loading ? 'translate-y-[-150%] opacity-0' : '', wrapClass, format === 'spread' ? '' : 'justify-center']"
    >
      <div v-if="icon || iconAfter" class="flex space-x-1 items-center">
        <div v-if="icon" class="" :class="[cls.iconClasses, icon, iconAdjust.both, iconAdjust.before]" />
        <div v-if="hasContent" class="txt"><slot /></div>
        <div v-if="iconAfter" class="" :class="[cls.iconClasses, iconAfter, iconAdjust.both, iconAdjust.after]" />
      </div>
      <template v-else><slot /></template>
    </span>
  </component>
</template>

<style>
.xbutton{
  .word {
    display: inline; /* ensures words do not break */
    white-space: nowrap; /* prevents words from wrapping */
  }

  .fx {
    display: inline-block; /* keeps each letter block for individual animation */
    line-height: 1em;
  }
}

.animate-selected {
  animation: clickButton 0.3s linear forwards;
}

@keyframes clickButton {
  0% {
    opacity: 0.2;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
