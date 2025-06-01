<script lang="ts" setup>
import type { ButtonDesign, ButtonFontWeight, ButtonFormat, ButtonHover, ButtonRounding, ButtonShadow, ColorThemeUser, MediaObject, StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getNavComponentType, pathIsHref, shortId, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'
import { twMerge } from 'tailwind-merge'
import { animateItemEnter, splitLetters } from '../anim'
import XIcon from '../media/XIcon.vue'
import { getButtonClasses } from '../utils/utils'

defineOptions({ name: 'XButton' })

const {
  icon,
  iconAfter,
  href,
  disabled,
  design,
  hover,
  format,
  theme,
  size,
  rounding = 'full',
  shadow,
  fontWeight,
  loading,
  wrapClass,
  animate,
  tag,
  padding,
  respond,
  classes,
  card,
  label,
} = defineProps<{
  icon?: string | MediaObject
  iconAfter?: string | MediaObject
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
  padding?: string
  respond?: 'icon:sm' | 'icon:md' | 'icon:lg' | 'icon:xl'
  classes?: { button?: string, icon?: string }
  card?: Card
  label?: string
}>()

const site = vue.inject(SITE_INJECTION_KEY, vue.computed(() => undefined))
const prevent = vue.computed(() => !!(site.value?.siteMode.value === 'editable'))

const randomId = shortId()
const loaded = vue.ref(false)
const animateSelected = vue.ref()
function onClick() {
  if (animate) {
    animateSelected.value = true
    setTimeout(() => animateSelected.value = false, 1000)
  }
}

const cls = vue.computed(() => {
  const c = getButtonClasses({ rounding, design, theme, size, format, disabled, shadow, hover, fontWeight, padding })

  return {
    buttonClasses: twMerge(c.buttonClasses, classes?.button || ''),
    iconClasses: twMerge(c.iconClasses, classes?.icon || ''),
  }
})
const slots = vue.useSlots()

function hasNonWhitespaceText(vnodes: vue.VNode | vue.VNode[]): boolean {
  if (typeof window === 'undefined' || !vnodes)
    return true

  // Handle single VNode or array of VNodes
  const nodes = Array.isArray(vnodes) ? vnodes : [vnodes]

  return nodes.some((vnode: vue.VNode) => {
    // Check if it's a Text node
    if (vnode.type === Text) {
      return typeof vnode.children === 'string' && vnode.children.trim() !== ''
    }
    // Check children if they exist (recursively)
    if (Array.isArray(vnode.children)) {
      return hasNonWhitespaceText(vnode.children as vue.VNode[])
    }
    // Handle case where children is a string
    if (typeof vnode.children === 'string') {
      return vnode.children.trim() !== ''
    }
    return false
  })
}

const hasContent = vue.computed(() => {
  const slotVNodes = slots.default?.() ?? []
  return hasNonWhitespaceText(slotVNodes)
})
const iconAdjust = vue.computed(() => {
  const sz = size || 'md'
  const sizeAdjustments: Record<StandardSize, { gap: string }> = {
    'xxs': { gap: 'gap-0.5' },
    'xs': { gap: 'gap-1' },
    'sm': { gap: 'gap-1.5' },
    'md': { gap: 'gap-1.5' },
    'lg': { gap: 'gap-2.5' },
    'xl': { gap: 'gap-3' },
    '2xl': { gap: 'gap-4' },
  }

  return {
    gap: sizeAdjustments[sz].gap,
  }
})
const hasAnimation = vue.computed(() => !['none', 'basic', ''].includes(hover || '') && !disabled)

function loadAnimation() {
  splitLetters({ selector: `#${randomId} .txt` })
}

function doHoverAnimation() {
  if (!hasAnimation.value)
    return

  animateItemEnter({ targets: `#${randomId} .fx`, themeId: hover || 'fade', totalTime: 600 })
}

vue.onMounted(() => {
  vue.watch(() => hasAnimation.value, () => {
    if (hasAnimation.value)
      loadAnimation()
    else
      loaded.value = true
  }, { immediate: true })
})

const adjustedHref = vue.computed(() => {
  return href ? (card ? card.link(href) : href) : undefined
})

const linkProps = vue.computed(() => {
  const h = adjustedHref.value
  return pathIsHref(h) ? { href: h } : { to: h }
})

const textClass = vue.computed(() => {
  const out = respond?.includes('icon') ? ['hidden'] : []
  if (respond === 'icon:sm')
    out.push('sm:block')
  if (respond === 'icon:md')
    out.push('md:block')
  if (respond === 'icon:lg')
    out.push('lg:block')
  if (respond === 'icon:xl')
    out.push('xl:block')

  return out.join(' ')
})
</script>

<template>
  <component
    :is="prevent ? 'div' : getNavComponentType({ href: adjustedHref }, hover === 'none' ? 'div' : tag || 'button')"
    :id="randomId"
    v-bind="linkProps"
    class="xbutton group/button"
    :class="[cls.buttonClasses, animateSelected && animate ? 'animate-selected' : '']"
    :data-loading="loading"
    :data-theme="theme"
    :data-design="design"
    :data-size="size"
    :data-hover="hover"
    @click="onClick()"
    @mouseenter="doHoverAnimation()"
  >
    <div
      :class="!loading ? 'translate-y-[150%] opacity-0' : ''"
      class="absolute left-0 flex w-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
    >
      <svg
        :class="[loading ? 'animate-spin' : '', ['2xl', 'xl'].includes(size || '') ? 'size-6' : 'size-4']"
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
      <div v-if="!hasContent" class="txt w-0 opacity-0" aria-hidden="true">-</div> <!-- Zero-width text-height element make sure consistent heights -->
      <div class="flex items-center min-w-0" :class="iconAdjust.gap" :data-has-content="hasContent">
        <template v-if="icon || iconAfter || hasContent">
          <XIcon v-if="icon" :media="icon" class="text-[1.2em] shrink-0" :class="[cls.iconClasses]" />
          <div v-if="hasContent" class="txt truncate min-w-0" :class="textClass"><slot /></div>

          <XIcon v-if="iconAfter" :media="iconAfter" class="text-[1.2em] shrink-0" :class="[cls.iconClasses]" />
        </template>
        <template v-else>
          {{ label || 'Button' }}
        </template>
      </div>
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
