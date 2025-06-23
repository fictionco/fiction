<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import type { EditorLocation } from './EditorWrap.vue'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { createOption } from '@fiction/ui/inputs'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import PostShare from './InputPostShare.vue'
import PostAnalytics from './PostAnalytics.vue'
import PostPreview from './PostPreview.vue'

defineOptions({ name: 'PostOverview' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
  location: EditorLocation
}>()

const emit = defineEmits<{
  (event: 'update:location', payload: EditorLocation): void
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
  if (!post)
    return { words: 0, time: '0 min' }

  const wordCount = post.wordCount.value || 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  return {
    words: wordCount,
    time: `${readingTime} min read`,
  }
})

const hasCategory = vue.computed(() => post?.categories.value?.length || 0)
const hasTags = vue.computed(() => post?.tags.value?.length || 0)

const statusMap = vue.computed<NavListItem>(() => {
  const status = post?.status.value || 'draft'

  const statusMap = {
    draft: { icon: { class: 'i-tabler-edit' }, theme: 'default' },
    scheduled: { icon: { class: 'i-tabler-calendar' }, theme: 'orange' },
    published: { icon: { class: 'i-tabler-check' }, theme: 'green' },
    archived: { icon: { class: 'i-tabler-archive' }, theme: 'rose' },
  } as const

  return statusMap[status as keyof typeof statusMap] || statusMap.draft
})

const previewOpts = vue.computed(() => {
  return [

    createOption({
      key: 'group.share',
      label: 'Share',
      icon: { class: 'i-tabler-share' },
      input: 'group',
      options: [
        createOption({
          key: 'share',
          icon: { class: 'i-tabler-share' },
          input: PostShare,
          props: { post, card },
          options: [],
        }),
      ],
    }),
    createOption({
      key: 'group.preview',
      label: 'Preview',
      icon: { class: 'i-tabler-eye' },
      input: 'group',
      options: [
        createOption({
          key: 'preview',
          icon: { class: 'i-tabler-share' },
          input: PostPreview,
          props: { post, card },
          options: [],
        }),
      ],
    }),
    createOption({
      key: 'group.analytics',
      label: 'Analytics',
      icon: { class: 'i-tabler-chart-bar' },
      input: 'group',
      options: [
        createOption({
          key: 'analytics',
          icon: { class: 'i-tabler-share' },
          input: PostAnalytics,
          props: { post, card },
          options: [],
        }),
      ],
    }),
  ]
})
</script>

<template>
  <div v-if="post" class="max-w-screen-md mx-auto p-8">
    <div class="flex flex-col space-y-6 ">
      <!-- Main content overview -->
      <div class="">
        <div class="flex gap-6">
          <!-- Left column with primary info -->
          <div class="flex-grow space-y-6">
            <div>
              <div class="text-theme-400 dark:text-theme-500 text-sm mb-4">
                {{ post.publishAt.value ? dayjs(post.publishAt.value).format('MMM D, YYYY [at] h:mm A') : 'No Publish Time Set' }}
              </div>

              <h1 class="text-2xl lg:text-3xl font-semibold mb-1 text-balance x-font-title">
                {{ post.title.value || 'Untitled Post' }}
              </h1>
              <p v-if="post.subTitle.value" class="text-theme-600 dark:text-theme-300 text-lg lg:text-xl">
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
                design="link"
              >
                {{ toLabel(post?.status.value) }}
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
          </div>

          <!-- Right column with media -->
          <div>
            <div v-if="post.media.value?.url" class=" w-40 aspect-video shrink-0 rounded-md overflow-hidden border border-theme-200 dark:border-theme-700 shadow-sm">
              <XMedia
                :media="post.media.value"
                class="h-full w-full"
                image-mode="cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-theme-200 dark:border-theme-700">
        <FormEngine :options="previewOpts" :classes="{ groupPad: 'p-0', inputWrap: 'w-full' }" />
      </div>
    </div>
  </div>
</template>
