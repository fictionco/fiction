<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import XLink from '@fiction/ui/common/XLink.vue'

defineOptions({ name: 'CardLink' })

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  href: { type: String, default: undefined },
})
</script>

<template>
  <XLink :href="props.card.link(props.href)">
    <slot />
  </XLink>
</template>
