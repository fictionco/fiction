<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import XButton from '@fiction/ui/buttons/XButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const attrs = vue.useAttrs()

const siteStyling = vue.computed(() => props.card.site?.fullConfig.value?.styling?.buttons)
</script>

<template>
  <XButton
    v-bind="attrs"
    :rounding="siteStyling?.rounding"
    :design="siteStyling?.design"
    :hover="siteStyling?.hover"
  >
    <slot />
  </XButton>
</template>
