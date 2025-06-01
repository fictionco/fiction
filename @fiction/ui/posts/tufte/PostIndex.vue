<script lang="ts" setup>
import type { NavListItem } from '@fiction/core/schemas'
import type { Post } from '@fiction/posts'
import { dayjs, vue } from '@fiction/core'
import XButton from '../../buttons/XButton.vue'
import XText from '../../common/XText.vue'
import XMedia from '../../media/XMedia.vue'

defineOptions({ name: 'PostLayout' })

const { posts, featuredCount = 1 } = defineProps<{
  posts: Post[]
  featuredCount?: number
}>()

const items = vue.computed(() => posts.map((post, i) => {
  const isFeatured = i < featuredCount
  const author = post.authors?.value?.[0]?.fullName || 'Alex Chen'
  const date = post.dateAt?.value ? dayjs(post.dateAt.value).format('YYYY.MM.DD') : dayjs().format('YYYY.MM.DD')
  const readTime = Math.ceil(post.wordCount.value / 200) || 2.4

  return {
    post,
    isFeatured,
    author,
    date,
    stats: [
      { key: 'reads', label: `${readTime}k reads` },
      { key: 'responses', label: `${Math.floor(Math.random() * 50) + 20} responses` },
      { key: 'shares', label: `${Math.floor(Math.random() * 200) + 50} shares` },
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
            <span class="text-base font-sans text-theme-200">{{ item.author }}</span>
            <span class="font-mono text-xs">{{ item.date }}</span>
          </div>
        </div>
        <a
          :href="item.post.href?.value"
          class="text-primary-400 font-medium hover:text-theme-300 transition-colors text-sm"
        >
          Read →
        </a>
      </div>

      <!-- Content Row -->
      <div class="flex gap-12 @[900px]/index:gap-20">
        <div class="flex-1 space-y-4">
          <component
            :is="item.isFeatured ? 'h1' : 'h2'"
            class="font-bold text-white max-w-[55ch]"
            :class="item.isFeatured ? 'text-4xl' : 'text-2xl'"
          >
            {{ item.post.title?.value }}
          </component>

          <XText
            v-if="item.post.subTitle?.value"
            :text="item.post.subTitle.value"
            class="text-theme-300"
            :class="{ 'text-lg': item.isFeatured }"
          />

          <div v-if="item.isFeatured" class="text-theme-400 text-xs pt-4 font-mono">
            <template v-for="(stat, i) in item.stats" :key="stat.key">
              <span>{{ stat.label }}</span>
              <span v-if="i < item.stats.length - 1" class="mx-2">•</span>
            </template>
          </div>
        </div>

        <XMedia
          v-if="item.post.media?.value"
          :media="item.post.media.value"
          class="rounded-lg object-cover bg-theme-800 flex-shrink-0 overflow-hidden"
          :class="[
            item.isFeatured ? 'w-[300px] h-[200px]' : 'w-[200px] h-[150px]',
          ]"
        />
      </div>
    </article>
  </div>
</template>
