<script lang="ts" setup>
import type { MediaDisplayObject, vue } from '@fiction/core'

defineProps({
  logo: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
})
</script>

<template>
  <RouterLink
    to="/"
    class="hover:text-primary-600 x-font-title block text-2xl font-bold transition-all"
  >
    <template v-if="logo?.url">
      <img :src="logo?.url" class="h-6">
    </template>
    <span v-else v-html="logo?.html || 'Your Name'" />
  </RouterLink>
</template>
