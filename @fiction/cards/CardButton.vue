<script lang="ts" setup>
import { type ActionButton, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import type { Card } from '@fiction/site/card'

const { card, href, theme, design, size, rounding } = defineProps<{
  card: Card
  href?: string
  theme?: ActionButton['theme']
  design?: ActionButton['design']
  size?: ActionButton['size']
  rounding?: ActionButton['rounding']
} >()

const attrs = vue.useAttrs()

const siteStyling = vue.computed(() => card.site?.fullConfig.value?.styling?.buttons)
const buttonProps = vue.computed(() => {
  return {
    ...attrs,
    href: href ? card.link(href) : undefined,
    theme,
    size,
    rounding: rounding || siteStyling.value?.rounding,
    design: design || siteStyling.value?.design,
    hover: siteStyling.value?.hover,
  }
})
</script>

<template>
  <XButton v-bind="buttonProps">
    <slot />
  </XButton>
</template>
