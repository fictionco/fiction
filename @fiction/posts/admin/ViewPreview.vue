<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SinglePost from '../ui/SinglePost.vue'
import PostLoad from './PostLoad.vue'

defineOptions({ name: 'ViewPostPreview' })

const { card } = defineProps<{
  card: Card
}>()
</script>

<template>
  <div class="h-full overflow-scroll">
    <PostLoad v-slot="{ post, loading }">
      <SinglePost :post :card :loading class="pb-24 lg:pb-36" />
    </PostLoad>
  </div>
</template>
