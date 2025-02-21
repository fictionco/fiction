<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import type { ViewMode, ViewModeKey } from './PagePostEdit.vue'

defineOptions({ name: 'ViewPostPreview' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
  viewModes: ViewMode[]
  activeKey: ViewModeKey
}>()
</script>

<template>
  <div class="h-full">
    test
  </div>
</template>
