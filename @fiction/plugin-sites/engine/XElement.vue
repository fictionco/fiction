<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '../card'
import type { UiConfig } from '../theme'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
  themeEl: { type: String as vue.PropType<keyof UiConfig>, required: true },
})

const el = vue.computed(() => {
  const config = props.card.site?.theme?.value?.getUi({ elementId: props.themeEl })
  return config?.el
})
</script>

<template>
  <component :is="el">
    <slot />
  </component>
</template>
