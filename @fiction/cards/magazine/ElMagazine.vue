<script lang="ts" setup>
import { useService, vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import type { FictionPosts } from '@fiction/plugin-posts'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'
import type { UserConfig } from '.'

defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const postId = vue.computed(() => service.fictionRouter.params.value.itemId)
</script>

<template>
  <div>
    <ElMagazineSingle v-if="postId" :card="card" />
    <ElMagazineIndex v-else :card="card" />
  </div>
</template>
