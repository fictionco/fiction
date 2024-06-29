<script lang="ts" setup>
import type { MediaDisplayObject, vue } from '@fiction/core'

defineProps({
  logo: { type: Object as vue.PropType<MediaDisplayObject>, default: undefined },
})
</script>

<template>
  <RouterLink
    to="/"
    class="hover:text-primary-600 x-font-title block text-2xl font-bold transition-all"
  >
    <img v-if="logo?.format === 'url' || (!logo?.format && logo?.url)" :src="logo.url" alt="Logo" class="h-9">
    <span v-else-if="logo?.format === 'html' || (!logo?.format && logo?.html)" v-html="logo.html" />
    <span v-else>Hello World</span>
  </RouterLink>
</template>
