<script lang="ts" setup>
import type { NavListItem } from '@fiction/core/schemas'
import type { Post } from '@fiction/posts'
import { dayjs, getMediaAspectMode, vue } from '@fiction/core'
import XButton from '../../buttons/XButton.vue'
import XLink from '../../common/XLink.vue'

import XText from '../../common/XText.vue'
import XMedia from '../../media/XMedia.vue'

defineOptions({ name: 'PostLayout' })

const { posts, featuredCount = 1 } = defineProps<{
  posts: Post[]
  featuredCount?: number
}>()

function getImageClasses(args: { post: Post }) {
  const { post } = args
  const m = post.media?.value
  const aspectMode = m?.aspect ? m.aspect : post.media?.value ? getMediaAspectMode(post.media.value) : 'landscape'

  const base = 'rounded-lg bg-theme-800 overflow-hidden flex-shrink-0 '

  if (aspectMode === 'portrait')
    return `${base} w-16 sm:w-20 md:w-[14%] aspect-[3/4]`
  if (aspectMode === 'square')
    return `${base} w-16 sm:w-20 md:w-[18%] aspect-square`
  return `${base} w-20 sm:w-24 md:w-[25%] aspect-[4/3]`
}

const items = vue.computed(() => posts.map((post, i) => {
  const isFeatured = i < featuredCount
  const author = post.authors?.value?.[0]?.fullName
  const date = post.dateAt?.value ? dayjs(post.dateAt.value).format('YYYY.MM.DD') : dayjs().format('YYYY.MM.DD')
  const readTime = Math.ceil(post.wordCount.value / 200)
  const likeCount = post.likeCount?.value || 0
  const commentCount = post.commentCount?.value || 0

  return {
    post,
    isFeatured,
    author,
    date,
    stats: [
      { key: 'reads', label: `${readTime}m read` },
      { key: 'likes', label: `${likeCount} likes`, onClick: () => post.like.toggle(), isActive: post.like.isLiked.value },
      { key: 'responses', label: `${commentCount} responses` },
    ] as NavListItem[],
  }
}))
</script>

<template>
  <div class="space-y-24 @container/index">
    <article
      v-for="item in items"
      :key="item.post.postId"
      class=""
    >
      <!-- Meta Row -->
      <div class="flex items-center justify-between mb-6 border-b border-theme-700 py-2">
        <div class="flex items-center gap-4 text-theme-400 text-sm">
          <XButton
            v-if="item.isFeatured"
            size="xs"
            theme="primary"
            class="font-medium"
            design="outline"
          >
            Featured
          </XButton>
          <div class="flex items-baseline gap-2">
            <span class="text-base font-sans text-theme-200 font-medium">{{ item.author }}</span>
            <span class="font-mono text-xs">{{ item.date }}</span>
          </div>
        </div>

        <XButton
          :href="item.post.href?.value"
          size="sm"
          theme="default"
          class="font-medium"
          design="link"
          icon-after="i-tabler-arrow-right"
        >
          Read
        </XButton>
      </div>

      <!-- Content Row -->
      <div class="flex justify-between gap-12 @[900px]/index:gap-20">
        <div class="flex-1 space-y-4 max-w-[800px]">
          <XLink class="block hover:opacity-80" :href="item.post.href.value">
            <XText
              :tag="item.isFeatured ? 'h1' : 'h2'"
              class="font-bold text-2xl lg:text-4xl x-font-title"
              :model-value="item.post.title?.value"
            />
          </XLink>
          <XText
            v-if="item.post.subTitle?.value"
            :model-value="item.post.subTitle.value"
            class="text-theme-400 text-2xl"
          />

          <div class="text-theme-400 text-sm pt-4 font-mono">
            <template v-for="(stat, i) in item.stats" :key="stat.key">
              <span
                :class="[
                  stat.isActive ? 'text-primary-400 cursor-pointer' : '',
                  stat.onClick ? 'cursor-pointer hover:opacity-80' : '',
                ]"
                @click="stat.onClick?.({ event: $event, item: stat })"
              >{{ stat.label }}</span>
              <span v-if="i < item.stats.length - 1" class="mx-2">•</span>
            </template>
          </div>
        </div>

        <XLink
          v-if="item.post.media?.value"
          class="block hover:opacity-80"
          :href="item.post.href.value"
          :class="getImageClasses({ post: item.post })"
        >
          <XMedia
            v-if="item.post.media?.value"
            :media="item.post.media.value"
            class="w-full h-full object-cover"
          />
        </XLink>
      </div>
    </article>
  </div>
</template>
