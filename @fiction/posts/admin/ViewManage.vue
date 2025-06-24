<script lang="ts" setup>
import type { Card } from '@fiction/site'
import PagePostIndex from './PagePostIndex.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <div class="max-w-[920px] mx-auto py-12">
    <PagePostIndex :card />
  </div>
</template>
