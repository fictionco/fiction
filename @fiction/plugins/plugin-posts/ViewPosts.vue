<script lang="ts" setup>
import type { vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import PostsIndex from './PostsIndex.vue'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <div class="py-12" :class="card.classes.value.contentWidth">
    <PostsIndex :card="card" />
  </div>
</template>
