<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import type { Card } from '@fiction/site'

defineProps({
  logo: { type: Object as vue.PropType<MediaObject>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <RouterLink
    :to="card.link('/')"
    class="flex hover:text-primary-600 dark:hover:text-primary-400 x-font-title text-2xl font-medium transition-all"
  >
    <img v-if="logo?.format === 'url' && logo?.url || (!logo?.format && logo?.url)" :src="logo.url" class="h-10">
    <span v-else-if="logo?.format === 'html' || (!logo?.format && logo?.html)" class="inline-block " v-html="logo.html" />
    <span v-else class="inline-block" v-html="logo?.html" />
  </RouterLink>
</template>
