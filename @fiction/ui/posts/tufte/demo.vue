<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import CardWrap from '@fiction/cards/CardWrap.vue'
import { vue } from '@fiction/core'
import { getDemoPosts } from '../index.js'
import PostIndex from './PostIndex.vue'

defineOptions({ name: 'PostIndexDemo' })

const { card } = defineProps<{ card: Card }>()

const posts = vue.shallowRef<Post[]>([])
const loading = vue.ref(true)

vue.onMounted(async () => {
  posts.value = await getDemoPosts({ card })
  loading.value = false
})
</script>

<template>
  <CardWrap :card>
    <PostIndex :posts :featured-count="1" />
  </CardWrap>
</template>
