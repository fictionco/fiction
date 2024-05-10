<script lang="ts" setup>
import { unhead, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionPosts, Post } from '@fiction/plugin-posts'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import El404 from '@fiction/ui/page/El404.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElAuthor from './ElAuthor.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: {  type: Object as vue.PropType<Card<UserConfig>>, required: true,},
  loading: { type: Boolean, default: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
})

const service = useService<{ fictionPosts: FictionPosts }>()



const userIsAuthor = vue.computed(() => {
  return props.post?.settings.authors?.some(a => a.userId === service.fictionUser.activeUser.value?.userId)
})
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl mx-auto focus:outline-none `

const imageAspect = vue.computed(() => {
  const img = props.post?.image.value
  const h = img?.height
  const w = img?.width

  if (!img || !w || !h)
    return 'aspect-[2/1]'

  return w > h ? 'aspect-square max-h-[70dvh]' : 'aspect-[2/1]'
})
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700"
    >
      <ElSpinner class="h-12 w-12" />
    </div>
    <article v-if="post" class="p-8 pb-44" :class="card.classes.value.contentWidth">
      <div class="space-y-8 my-[min(max(35px,_5vw),_60px)] prose:max-w-none text-center max-w-screen-lg mx-auto" :class="proseClass">
        <div class="tags space-x-3">
          <ElBadge theme="naked" :href="card.link('/:viewId')">
            &larr; All Posts
          </ElBadge>
          <ElBadge v-for="(categories, i) in post.categories.value" :key="i" theme="theme">
            {{ categories.title }}
          </ElBadge>
          <ElBadge v-if="userIsAuthor" theme="theme" :href="post.editLink.value">
            Edit Post <span class="ml-1 i-heroicons-arrow-up-right-20-solid" />
          </ElBadge>
        </div>
        <h1 class="text-6xl font-bold x-font-title text-balance">
          {{ post.title.value }}
        </h1>
        <h3 class=" font-medium dark:text-theme-400 text-balance">
          {{ post.subTitle.value }}
        </h3>
        <div class="flex justify-center">
          <ElAuthor v-for="(author, i) in post.authors.value" :key="i" :user="author" :date-at="post.dateAt.value" />
        </div>
      </div>
      <ClipPathAnim :enabled="true" class="my-[min(max(35px,_5vw),_60px)]">
        <div v-if="post.image.value?.url" class=" mx-auto relative overflow-hidden rounded-lg" :class="imageAspect">
          <!-- Optionally display media -->
          <img :src="post.image.value?.url" alt="Post media" class="absolute h-full w-full object-cover object-center">
        </div>
      </ClipPathAnim>
      <div class="content-container px-4" :class="proseClass" v-html="post.content.value" />

      <div v-if="post.tags.value?.length" class="tags flex gap-4 mt-12 mb-8 items-center px-4 justify-center" :class="proseClass">
        <div class="text-xs italic text-theme-500">
          tagged with &rarr;
        </div>
        <div class="gap-3 flex">
          <ElBadge v-for="(tags, i) in post.tags.value" :key="i" theme="theme">
            {{ tags.title }}
          </ElBadge>
        </div>
      </div>
    </article>
    <El404 v-else heading="Post Not Found" :actions="[{ name: 'All Posts', href: card.link('/:viewId') }]" />
  </div>
</template>

<style lang="less">
.content-container > p:first-of-type::first-letter {
  font-size: 2em;
    line-height: 1;
    margin-right: 0.1rem;
    text-transform: uppercase;

}
</style>
