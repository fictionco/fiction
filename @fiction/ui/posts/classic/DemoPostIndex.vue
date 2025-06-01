<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import CardWrap from '@fiction/cards/CardWrap.vue'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getDemoPosts } from '../index.js'
import PostIndexLayout from './PostIndexLayout.vue'

defineOptions({ name: 'PostIndexDemo' })

const { card } = defineProps<{ card: Card }>()

// Layout presets with minimal but useful options
const presets = [
  {
    name: 'Blog',
    config: {
      layout: 'blog',
      featuredCount: 1,
      headline: 'Some of our latest articles',
    },
  },
  {
    name: 'Magazine',
    config: {
      layout: 'magazine',
      featuredCount: 1,
      headline: 'Built for testing the headline. This is a long headline to test the layout.',
    },
  },
  {
    name: 'Featured Only',
    config: {
      layout: 'blog',
      featuredCount: 3,
    },
  },
  {
    name: 'No Featured',
    config: {
      layout: 'blog',
      featuredCount: 0,
    },
  },
  {
    name: 'Full Width',
    config: {
      layout: 'magazine',
      featuredCount: 1,
    },
  },
] as const

const activePreset = vue.ref(0)
const currentConfig = vue.computed(() => presets[activePreset.value].config)

const posts = vue.shallowRef<Post[]>([])
const loading = vue.ref(true)

vue.onMounted(async () => {
  posts.value = await getDemoPosts({ card })
  loading.value = false
})
</script>

<template>
  <CardWrap :card vertical-spacing="sm">
    <!-- Controls -->
    <div class="space-y-16">
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
      <PostIndexLayout
        :posts="posts"
        :loading="loading"
        title="Latest Articles"
        v-bind="currentConfig"
        :card
      />
    </div>
  </CardWrap>
</template>
