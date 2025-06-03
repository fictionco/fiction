<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { UserConfig } from './config'
import CardWrap from '@fiction/cards/CardWrap.vue'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import { getDemoPosts } from '@fiction/ui/posts/index.js'
import AvatarImage from './avatar.jpg'
import PostIndex from './PostIndex.vue'
import PostSingle from './PostSingle.vue'

defineOptions({ name: 'PostDemo' })

const { card } = defineProps<{ card: Card }>()

const posts = vue.shallowRef<Post[]>([])
const loading = vue.ref(true)

const isSingleView = vue.computed(() => {
  if (typeof window === 'undefined')
    return false
  const url = new URL(window.location.href)
  return url.searchParams.get('single')
})

const selectedPost = vue.computed(() => posts.value[0])

vue.onMounted(async () => {
  posts.value = await getDemoPosts({ card })
  loading.value = false
})

const testCard = vue.computed(() => {
  return new Card<UserConfig>({
    templateId: 'cardBlogV1',
    userConfig: {
      title: 'Tufte Posts',
      subTitle: 'A demo of Tufte posts layout',
      media: {
        url: AvatarImage,
        aspect: 'square' as const,
      },
    },
  })
})
</script>

<template>
  <CardWrap :card>
    <PostSingle
      v-if="isSingleView && selectedPost"
      :post="selectedPost"
    />
    <PostIndex
      v-else
      :card="testCard"
      :posts
      :featured-count="1"
    />
  </CardWrap>
</template>
