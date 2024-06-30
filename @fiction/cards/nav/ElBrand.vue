<script lang="ts" setup>
import type { MediaDisplayObject, vue } from '@fiction/core'
import type { Card } from '@fiction/site'

defineProps({
  logo: { type: Object as vue.PropType<MediaDisplayObject>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <RouterLink
    :to="card.link('/')"
    class="hover:text-primary-600 dark:hover:text-primary-400 x-font-title block text-2xl font-medium transition-all"
  >
    <img v-if="logo?.format === 'url' && logo?.url || (!logo?.format && logo?.url)" :src="logo.url" alt="Logo" class="h-9">
    <span v-else-if="logo?.format === 'html' || (!logo?.format && logo?.html)" v-html="logo.html" />
    <span v-else v-html="logo?.html" />
  </RouterLink>
</template>
