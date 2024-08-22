<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import XButton from '@fiction/ui/buttons/XButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  href: { type: String, default: undefined },
})

const attrs = vue.useAttrs()

const siteStyling = vue.computed(() => props.card.site?.fullConfig.value?.styling?.buttons)
const buttonProps = vue.computed(() => {
  return {
    ...attrs,
    href: props.href ? props.card.link(props.href) : undefined,
    rounding: siteStyling.value?.rounding,
    design: siteStyling.value?.design,
    hover: siteStyling.value?.hover,
  }
})
</script>

<template>
  <XButton v-bind="buttonProps">
    <slot />
  </XButton>
</template>
