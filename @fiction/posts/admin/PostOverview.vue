<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import PostAnalytics from './PostAnalytics.vue'
import PostPreview from './PostPreview.vue'
import PostShare from './PostShare.vue'

defineOptions({ name: 'PostOverview' })

const props = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'navigate', payload: { key: 'compose' }): void
}>()

const service = useService()

const panels = [
  { key: 'preview', label: 'Preview' },
  { key: 'share', label: 'Share' },
  { key: 'analytics', label: 'Analytics' },
]

type PanelModeKey = 'preview' | 'share' | 'analytics'
const activePanelKey = vue.computed<PanelModeKey>({
  get: () => {
    const r = service.fictionRouter.query.value
    return r.panel as PanelModeKey || 'preview'
  },
  set: async (value) => {
    const r = service.fictionRouter.query.value
    await service.fictionRouter.push({ query: { ...r, panel: value } }, { caller: 'activePanelKey' })
  },
})

const activePanel = vue.computed(() => panels.find(p => p.key === activePanelKey.value) || panels[0])

// Calculate word count and reading time
const readingStats = vue.computed(() => {
  if (!props.post)
    return { words: 0, time: '0 min' }

  const wordCount = props.post.wordCount.value || 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  return {
    words: wordCount,
    time: `${readingTime} min read`,
  }
})

const hasCategory = vue.computed(() => props.post?.categories.value?.length || 0)
const hasTags = vue.computed(() => props.post?.tags.value?.length || 0)

const statusMap = vue.computed<NavListItem>(() => {
  const post = props.post
  const status = post?.status.value || 'draft'

  const statusMap = {
    draft: { icon: { class: 'i-tabler-edit' }, theme: 'default' },
    scheduled: { icon: { class: 'i-tabler-calendar' }, theme: 'orange' },
    published: { icon: { class: 'i-tabler-check' }, theme: 'green' },
    archived: { icon: { class: 'i-tabler-archive' }, theme: 'rose' },
  } as const

  return statusMap[status as keyof typeof statusMap] || statusMap.draft
})
</script>

<template>
  <div v-if="post" class="max-w-screen-xl mx-auto my-8">
    <div class="flex flex-col space-y-6 ">
      <!-- Main content overview -->
      <div class="bg-theme-50 dark:bg-theme-800 rounded-lg p-6 lg:p-8 xl:p-14 border border-theme-200 dark:border-theme-600/70 shadow-sm">
        <div class="flex gap-6">
          <!-- Left column with primary info -->
          <div class="flex-grow space-y-6">
            <div>
              <div class="text-theme-400 dark:text-theme-500 text-sm mb-4">
                {{ post.publishAt.value ? dayjs(post.publishAt.value).format('MMM D, YYYY [at] h:mm A') : 'No Publish Time Set' }}
              </div>

              <h1 class="text-2xl font-semibold mb-1 text-balance">
                {{ post.title.value || 'Untitled Post' }}
              </h1>
              <p v-if="post.subTitle.value" class="text-theme-600 dark:text-theme-300 text-lg">
                {{ post.subTitle.value || 'No Subtitle' }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 items-center text-sm">
              <XButton
                v-if="post?.status"
                :theme="statusMap.theme"
                target="_blank"
                size="sm"
                :icon="statusMap.icon"
                data-test-id="post-status-badge"
                design="outline"
              >
                {{ toLabel(post?.status.value) }}
              </XButton>
              <XButton
                v-if="post?.emailStatus && post?.emailStatus.value !== post?.status.value"
                theme="default"
                target="_blank"
                size="sm"
                icon="i-tabler-mail"
                data-test-id="post-email-status-badge"
                design="outline"
              >
                {{ toLabel(post?.emailStatus.value) }}
              </XButton>

              <div class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-file-text" />
                <span>{{ readingStats.words }} words</span>
              </div>

              <div class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-clock" />
                <span>{{ readingStats.time }}</span>
              </div>

              <div v-if="post.visibility.value" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-eye" />
                <span class="capitalize">{{ post.visibility.value }}</span>
              </div>

              <div v-if="hasCategory" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-folder" />
                <span>{{ post.categories.value.length }} {{ post.categories.value.length === 1 ? 'category' : 'categories' }}</span>
              </div>

              <div v-if="hasTags" class="flex items-center gap-1 text-theme-500">
                <i class="i-tabler-tag" />
                <span>{{ post.tags.value.length }} {{ post.tags.value.length === 1 ? 'tag' : 'tags' }}</span>
              </div>
            </div>

            <div v-if="post.excerpt.value" class="prose dark:prose-invert">
              <p class="italic text-theme-600 dark:text-theme-300">
                {{ post.excerpt.value }}
              </p>
            </div>

            <div class="pt-4 flex flex-wrap gap-3">
              <XButton
                icon="i-tabler-eye"
                design="outline"
                :theme="activePanelKey === 'preview' ? 'primary' : 'default'"
                size="sm"
                @click="activePanelKey = 'preview'"
              >
                Preview
              </XButton>

              <XButton
                icon="i-tabler-share"
                design="outline"
                :theme="activePanelKey === 'share' ? 'primary' : 'default'"
                size="sm"
                @click="activePanelKey = 'share'"
              >
                Share Options
              </XButton>

              <XButton
                icon="i-tabler-chart-bar"
                design="outline"
                :theme="activePanelKey === 'analytics' ? 'primary' : 'default'"
                size="sm"
                @click="activePanelKey = 'analytics'"
              >
                Analytics
              </XButton>

              <XButton
                icon="i-tabler-edit"
                design="outline"
                size="sm"
                @click="emit('navigate', { key: 'compose' })"
              >
                Edit Post
              </XButton>
            </div>
          </div>

          <!-- Right column with media -->
          <div v-if="post.media.value?.url" class="w-40 h-40 shrink-0 rounded-md overflow-hidden border border-theme-200 dark:border-theme-700 shadow-sm">
            <XMedia
              :media="post.media.value"
              class="h-full w-full"
              image-mode="cover"
            />
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-theme-200 dark:border-theme-700">
        <h2 class="text-lg font-medium mb-4">
          {{ activePanel.label }}
        </h2>
        <PostShare v-if="activePanel.key === 'share'" :post :card />
        <PostAnalytics v-else-if="activePanel.key === 'analytics'" :post :card />
        <PostPreview v-else :post :card />
      </div>
    </div>
  </div>
</template>
