<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import { Post as PostModel } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getDemoPosts } from './index.js'
import PostSingle from './PostSingle.vue'

defineOptions({ name: 'DemoPostSingle' })

const { card } = defineProps<{ card?: Card }>()

// Demo post configuration options
const renderOptions = [
  {
    name: 'Default',
    config: {
      showLikes: true,
      showComments: true,
      dropCap: false,
    },
  },
  {
    name: 'With Drop Cap',
    config: {
      showLikes: true,
      showComments: true,
      dropCap: true,
    },
  },
  {
    name: 'Content Only',
    config: {
      showLikes: false,
      showComments: false,
      dropCap: false,
    },
  },
] as const

// Sample sidebar content for demo
const relatedPosts = [
  {
    title: 'The Art of Compelling Headlines',
    excerpt: 'Learn how to write headlines that grab attention and drive engagement',
    slug: 'headline-writing-guide',
  },
  {
    title: 'Visual Hierarchy in Blog Design',
    excerpt: 'Create intuitive visual experiences that guide readers through your content',
    slug: 'visual-hierarchy-guide',
  },
  {
    title: 'The Science of Memorable Ideas',
    excerpt: 'Discover why some ideas stick while others fade away',
    slug: 'idea-memorability',
  },
]

const activeOption = vue.ref(0)
const currentConfig = vue.computed(() => renderOptions[activeOption.value].config)

const post = vue.shallowRef<Post>()
const loading = vue.ref(true)
const likeCount = vue.ref(42)
const commentCount = vue.ref(7)
const isLiked = vue.ref(false)

function handleLikeUpdate(count: number) {
  likeCount.value = count
  isLiked.value = !isLiked.value
}

vue.onMounted(async () => {
  // Get demo posts and select the first one for display
  const demoPosts = (await getDemoPosts()).sort(() => Math.random() - 0.5)
  if (demoPosts.length > 0) {
    // Find a post with substantial content
    const targetPost = demoPosts[0]

    post.value = new PostModel({ ...targetPost, card })
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-[1300px] mx-auto px-4 py-6 @container/demo">
    <!-- Controls -->
    <div class="border border-theme-200 dark:border-theme-700 rounded-lg p-6 space-y-4 mb-8">
      <h2 class="text-xl font-bold mb-4">
        Single Post Demo
      </h2>
      <div class="flex flex-wrap gap-2">
        <XButton
          v-for="(option, index) in renderOptions"
          :key="option.name"
          :theme="activeOption === index ? 'primary' : 'theme'"
          design="solid"
          size="sm"
          @click="activeOption = index"
        >
          {{ option.name }}
        </XButton>
      </div>

      <!-- Configuration display -->
      <pre class="text-xs font-mono border border-theme-200 dark:border-theme-700 p-3 rounded-md overflow-auto mt-4 text-theme-700 dark:text-theme-300">{{ JSON.stringify(currentConfig, null, 2) }}</pre>
    </div>

    <!-- Layout with main content and sidebar -->
    <div class=" ">
      <PostSingle
        class="max-w-2xl mx-auto text-lg"
        :card="card"
        :post="post"
        :loading="loading"
        :like-count="likeCount"
        :comment-count="commentCount"
        :is-liked="isLiked"
        :drop-cap="currentConfig.dropCap"
        :show-social="currentConfig.showLikes || currentConfig.showComments"
        @update:like-count="handleLikeUpdate"
      />
    </div>
  </div>
</template>
