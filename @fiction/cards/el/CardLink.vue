<script lang="ts" setup>
import type { Card } from '@fiction/site'
import XLink from '@fiction/ui/common/XLink.vue'

defineOptions({ name: 'CardLink' })

const { card, href } = defineProps<{
  card: Card
  href?: string
}>()
</script>

<template>
  <XLink
    :href="card.link(href)"
    :should-prevent="card.site?.siteMode.value === 'editable'"
  >
    <slot />
  </XLink>
</template>
