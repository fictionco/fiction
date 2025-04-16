<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import { Post as PostModel } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getDemoPosts } from './index.js'
import SinglePost from './PostSingle.vue'
import SidebarWidget from './SidebarWidget.vue'

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
    const targetPost = demoPosts.find(p =>
      p.content
      && p.media?.url
      && p.authors?.length,
    ) || demoPosts[0]

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
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main content area -->
      <div class="flex-1">
        <SinglePost
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

      <!-- Sidebar -->
      <div class="w-full lg:w-80 @lg/demo:block @container/sidebar space-y-8">
        <SidebarWidget title="About the Author">
          <div v-if="post && post.authors?.value?.length > 0" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="size-14 rounded-full overflow-hidden bg-theme-100 dark:bg-theme-800">
                <img
                  v-if="post.authors.value[0].avatar?.url"
                  :src="post.authors.value[0].avatar.url"
                  :alt="post.authors.value[0].fullName || ''"
                  class="size-full object-cover"
                >
                <div
                  v-else
                  class="size-full flex items-center justify-center text-theme-500 dark:text-theme-400"
                >
                  <div class="i-tabler-user text-2xl" />
                </div>
              </div>
              <div>
                <div class="font-bold text-base">
                  {{ post.authors.value[0].fullName || 'Author' }}
                </div>
                <div class="text-sm text-theme-500 dark:text-theme-400">
                  {{ post.authors.value[0].title || 'Content Creator' }}
                </div>
              </div>
            </div>
            <p class="text-theme-600 dark:text-theme-300 text-sm">
              Expert in digital marketing, content strategy, and audience engagement.
              Passionate about creating helpful resources and sharing industry insights.
            </p>
            <XButton theme="primary" design="outline" size="sm" href="#" icon-after="i-tabler-arrow-up-right">
              View Profile
            </XButton>
          </div>
        </SidebarWidget>

        <SidebarWidget title="Related Articles">
          <div class="space-y-4">
            <div
              v-for="(related, index) in relatedPosts"
              :key="index"
              class="group"
            >
              <a href="#" class="block space-y-1">
                <h3 class="font-medium group-hover:text-primary-400 transition-colors">
                  {{ related.title }}
                </h3>
                <p class="text-sm text-theme-500 dark:text-theme-400 line-clamp-2">
                  {{ related.excerpt }}
                </p>
              </a>
            </div>
          </div>
        </SidebarWidget>

        <SidebarWidget title="Categories">
          <div class="flex flex-wrap gap-2">
            <a
              v-for="category in ['Design', 'Marketing', 'Writing', 'Psychology']"
              :key="category"
              href="#"
              class="px-3 py-1 text-xs rounded-full bg-theme-100 dark:bg-theme-800 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900 dark:hover:text-primary-300 transition-colors"
            >
              {{ category }}
            </a>
          </div>
        </SidebarWidget>

        <SidebarWidget title="Share This Post">
          <div class="flex gap-2">
            <button
              v-for="(platform, i) in [
                { name: 'Twitter', icon: 'i-tabler-brand-x' },
                { name: 'Facebook', icon: 'i-tabler-brand-facebook' },
                { name: 'LinkedIn', icon: 'i-tabler-brand-linkedin' },
                { name: 'Email', icon: 'i-tabler-mail' },
              ]"
              :key="i"
              class="size-9 rounded-full flex items-center justify-center bg-theme-100 dark:bg-theme-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              :aria-label="`Share on ${platform.name}`"
            >
              <XIcon :media="{ class: platform.icon }" class="size-5" />
            </button>
          </div>
        </SidebarWidget>
      </div>
    </div>
  </div>
</template>
