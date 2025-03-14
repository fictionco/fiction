<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import SiteText from '@fiction/cards/SiteText.vue'
import { dayjs, isDarkOrLightMode, pathCheck, PostSchema as schema, vue } from '@fiction/core'

import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

const { card, loading = false, post } = defineProps<{
  card: Card
  loading?: boolean
  post?: Post
  nextPost?: Post
}>()

const singlePostEl = vue.ref<HTMLElement>()
const darkLightModeClass = vue.ref()
vue.onMounted(() => {
  if (singlePostEl.value) {
    const md = isDarkOrLightMode(singlePostEl.value)
    darkLightModeClass.value = md
  }
})

const themeStyle = vue.computed(() => {
  return getColorThemeStyles(post?.theme.value)
})
</script>

<template>
  <div ref="singlePostEl">
    <div
      v-if="loading"
      class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700 "
    >
      <ElSpinner class="h-12 w-12" />
    </div>
    <article v-if="post" class="px-4 sm:px-8 @container/prose max-w-[850px] mx-auto ">
      <div
        class="flex flex-col gap-6 my-[min(max(35px,_5vw),_60px)] "
      >
        <div
          class="font-medium text-sm text-pretty"
          :class="themeStyle?.text"
        >
          {{ dayjs(post.dateAt.value || post.publishAt.value).format('MMMM D, YYYY') }}
        </div>
        <div class="space-y-2">
          <SiteText
            v-model="post.config.value"
            :card
            tag="h1"
            :path="pathCheck('title', schema)"
            :post="post"
            class="text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold x-font-title text-pretty"
          />
          <SiteText
            v-model="post.config.value"
            :card
            tag="h2"
            :path="pathCheck('subTitle', schema)"
            class="text-lg lg:text-2xl xl:text-4xl font-medium dark:text-theme-400 text-pretty"
          />
        </div>
        <div class="flex justify-start">
          <div
            v-for="(author, i) in post.authors.value"
            :key="i"
            class="text-base flex gap-4 items-center mt-4 not-prose"
          >
            <ElAvatar class="size-10 rounded-full ring-2 ring-white" :user="author" />
            <div class="text-left">
              <div class="font-bold text-base leading-[1.3]">
                {{ author.fullName || author.email?.split('@')[0] }}
              </div>
              <div
                class="text-sm text-pretty"
                :class="themeStyle?.text"
              >
                {{ author.email }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimClipPath :animate="true" class="my-[min(max(35px,_5vw),_60px)]" caller="magSingle">
        <XMedia
          :media="post.media.value"
          class="w-full"
          image-mode="inline"
        />
      </AnimClipPath>
      <div class="max-w-[900px] mx-auto ">
        <XEntry :theme="post.theme.value">
          <SiteText
            v-model="post.config.value"
            :card
            :path="pathCheck('content', schema)"
            class="text-base @[500px]/prose:text-base @[700px]/prose:text-2xl"
          />
        </XEntry>
      </div>
    </article>
    <El404
      v-else
      title="Post Not Found"
    />
  </div>
</template>
