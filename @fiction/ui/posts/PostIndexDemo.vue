<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import { Post as PostModel } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getDemoPosts } from './index.js'
import PostLayout from './PostLayout.vue'
import SidebarMediaItem from './SidebarMediaItem.vue'
import SidebarWidget from './SidebarWidget.vue'

defineOptions({ name: 'PostIndexDemo' })

const { card } = defineProps<{ card?: Card }>()

// Layout presets with minimal but useful options
const presets = [
  {
    name: 'Blog',
    config: {
      layout: 'blog',
      featuredCount: 1,
      showSidebar: true,
    },
  },
  {
    name: 'Magazine',
    config: {
      layout: 'magazine',
      featuredCount: 1,
      showSidebar: true,
    },
  },
  {
    name: 'Featured Only',
    config: {
      layout: 'blog',
      featuredCount: 3,
      showSidebar: false,
    },
  },
  {
    name: 'No Featured',
    config: {
      layout: 'blog',
      featuredCount: 0,
      showSidebar: true,
    },
  },
  {
    name: 'Full Width',
    config: {
      layout: 'magazine',
      featuredCount: 1,
      showSidebar: false,
    },
  },
] as const

// Sample about content
const aboutContent = {
  title: 'About This Blog',
  content: 'Join our community of readers and stay updated with the latest insights and stories.',
}

const activePreset = vue.ref(0)
const currentConfig = vue.computed(() => presets[activePreset.value].config)

const posts = vue.shallowRef<Post[]>([])
const loading = vue.ref(true)

// Mark a couple posts as featured for demo purposes
function markFeaturedPosts(allPosts: Post[]) {
  if (allPosts.length > 0) {
    allPosts[0].isFeatured.value = true

    if (allPosts.length > 3) {
      allPosts[3].isFeatured.value = true
    }

    if (allPosts.length > 5) {
      allPosts[5].isFeatured.value = true
    }
  }
  return allPosts
}

vue.onMounted(async () => {
  // Get demo posts and convert to Post objects
  const demoPosts = await getDemoPosts()
  posts.value = markFeaturedPosts(demoPosts.map(p => new PostModel({ ...p, card }))).sort(() => Math.random() - 0.5)
  loading.value = false
})
</script>

<template>
  <div class="space-y-8 max-w-screen-2xl mx-auto px-4 py-6" :class="card?.classes.value.contentWidth">
    <!-- Controls -->
    <div class="border border-theme-200 dark:border-theme-700 rounded-lg p-6 space-y-4">
      <div class="flex flex-wrap gap-2">
        <XButton
          v-for="(preset, index) in presets"
          :key="preset.name"
          :theme="activePreset === index ? 'primary' : 'theme'"
          design="solid"
          size="sm"
          @click="activePreset = index"
        >
          {{ preset.name }}
        </XButton>
      </div>

      <!-- Configuration display -->
      <pre class="text-xs font-mono border border-theme-200 dark:border-theme-700 p-3 rounded-md overflow-auto mt-4 text-theme-700 dark:text-theme-300">{{ JSON.stringify(currentConfig, null, 2) }}</pre>
    </div>

    <!-- Blog layout with current configuration -->
    <PostLayout
      :posts="posts"
      :loading="loading"
      title="Latest Articles"
      :about="aboutContent"
      :config="currentConfig"
    >
      <template #sidebar>
        <div class="space-y-10">
          <!-- About Widget -->
          <SidebarWidget title="About">
            <p class="text-theme-600 dark:text-theme-300 mb-4">
              This blog explores design principles, development techniques, and marketing strategies for modern digital products.
            </p>
            <XButton theme="primary" design="outline" size="md" href="#" icon-after="i-tabler-arrow-up-right">
              Subscribe
            </XButton>
          </SidebarWidget>
          <!-- Categories Widget -->
          <SidebarWidget title="Categories">
            <ul class="space-y-3 text-theme-700 dark:text-theme-300">
              <li><a href="#" class="hover:text-primary-400 transition-colors">Design</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Development</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Marketing</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Business</a></li>
            </ul>
          </SidebarWidget>

          <!-- Recommended Posts Widget -->
          <SidebarWidget title="Recommended">
            <div class="space-y-4">
              <SidebarMediaItem
                title="How to Build Better Products"
                subtitle="5 min read"
                href="#"
              />
              <SidebarMediaItem
                title="The Future of Design Systems"
                subtitle="8 min read"
                href="#"
              />
              <SidebarMediaItem
                title="Marketing Strategy Guide"
                subtitle="4 min read"
                href="#"
              />
            </div>
          </SidebarWidget>
        </div>
      </template>
    </PostLayout>
  </div>
</template>
