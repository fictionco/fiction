<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

const { card, href, theme, design, size, rounding, hover } = defineProps<{
  card: Card
  href?: string
  theme?: ActionButton['theme']
  design?: ActionButton['design']
  size?: ActionButton['size']
  rounding?: ActionButton['rounding']
  hover?: ActionButton['hover']
} >()

const attrs = vue.useAttrs()

const siteStyling = vue.computed(() => card.site?.fullConfig.value?.site?.buttons)
const buttonProps = vue.computed(() => {
  return {
    ...attrs,
    href: href ? card.link(href) : undefined,
    theme,
    size,
    rounding: rounding || siteStyling.value?.rounding,
    design: design || siteStyling.value?.design,
    hover: hover || siteStyling.value?.hover,
  }
})
</script>

<template>
  <XButton v-bind="buttonProps">
    <slot />
  </XButton>
</template>
