<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Post } from '@fiction/posts'
import { dayjs, toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import PostComments from './PostComments.vue'

defineOptions({ name: 'PostSingle' })

const { post, showComments = true } = defineProps<{
  post: Post
  showComments?: boolean
}>()

const postData = vue.computed(() => {
  const author = post.authors?.value?.[0]?.fullName || 'Anonymous'
  const date = post.dateAt?.value ? dayjs(post.dateAt.value) : dayjs()
  const readTime = Math.ceil((post.wordCount?.value || 0) / 200)
  const likeCount = post.likeCount?.value || 0
  const commentCount = post.commentCount?.value || 0

  return {
    author,
    date: date.format('MMMM D, YYYY'),
    dateISO: date.toISOString(),
    stats: [
      { key: 'reads', label: `${readTime}m read` },
      { key: 'likes', label: `${likeCount} likes`, onClick: () => post.like?.toggle(), isActive: post.like?.isLiked?.value },
      { key: 'responses', label: `${commentCount} responses` },
    ] as NavListItem[],
  }
})
</script>

<template>
  <article
    class="max-w-3xl mx-auto px-4 space-y-8 md:space-y-12 lg:space-y-16"
    itemscope
    itemtype="https://schema.org/BlogPosting"
  >
    <!-- Header -->
    <header class="border-b border-theme-700 pb-4">
      <div v-if="post.tags?.value?.length" class="flex justify-start gap-2 mb-4 md:mb-6">
        <XButton
          v-for="tag in post.tags.value.slice(0, 3)"
          :key="tag"
          size="xs"
          theme="default"
          design="ghost"
          rounding="md"
        >
          {{ toLabel(tag) }}
        </XButton>
      </div>

      <XText
        tag="h1"
        class="font-bold text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 x-font-title leading-[1.2]"
        :model-value="post.title?.value"
        itemprop="headline"
      />

      <XText
        v-if="post.subTitle?.value"
        :model-value="post.subTitle.value"
        class="text-theme-400 text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed"
        itemprop="description"
      />

      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center justify-start gap-2 md:gap-4 text-theme-400 text-sm">
          <span
            class="font-medium text-theme-200"
            itemprop="author"
            itemscope
            itemtype="https://schema.org/Person"
          >
            <span itemprop="name">{{ postData.author }}</span>
          </span>
          <span>•</span>
          <time
            class="font-mono text-xs"
            :datetime="postData.dateISO"
            itemprop="datePublished"
          >
            {{ postData.date }}
          </time>
        </div>
        <div class="text-theme-400 text-xs font-mono flex items-center gap-2">
          <template v-for="(stat, i) in postData.stats" :key="stat.key">
            <span
              :class="[
                stat.isActive ? 'text-primary-400 cursor-pointer' : '',
                stat.onClick ? 'cursor-pointer hover:opacity-80' : '',
              ]"
              @click="stat.onClick?.({ event: $event, item: stat })"
            >{{ stat.label }}</span>
            <span v-if="i < postData.stats.length - 1" class="mx-2">•</span>
          </template>
        </div>
      </div>
    </header>

    <div v-if="post.media?.value?.url" class="rounded-md overflow-hidden aspect-video">
      <XMedia
        :media="post.media.value"
        class="w-full h-full object-cover"
        :animate="true"
      />
    </div>

    <XEntry
      :theme="post.theme?.value"
      class=""
    >
      <div itemprop="articleBody" v-html="post.content?.value" />
    </XEntry>

    <footer class="border-t border-theme-700 pt-6 md:pt-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 md:gap-6 text-sm text-theme-400 font-mono">
          <template v-for="(stat, i) in postData.stats" :key="stat.key">
            <button
              v-if="stat.onClick"
              type="button"
              :class="{ 'text-theme-200': stat.isActive }"
              class="hover:text-theme-200 transition-colors"
              @click="stat.onClick ? stat.onClick({ event: $event, item: stat }) : null"
            >
              {{ stat.label }}
            </button>
            <span v-else>{{ stat.label }}</span>
            <span v-if="i < postData.stats.length - 1" class="mx-1">•</span>
          </template>
        </div>

        <XButton
          size="sm"
          theme="default"
          design="ghost"
          icon="i-tabler-share"
          class="hidden md:flex"
        >
          Share
        </XButton>
      </div>
    </footer>

    <PostComments v-if="showComments" :post :comments="post.settings.comments" />
  </article>
</template>
