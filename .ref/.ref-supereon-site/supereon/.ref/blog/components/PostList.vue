<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import ContentBox from '@factor/ui/ContentBox.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import { dayjs, useService, vue } from '@factor/api'
import type { FactorBlog, PostsOrPages } from '@factor/plugin-blog-engine'
import ShootingStar from '../../ShootingStar.vue'

const { factorBlog } = useService<{ factorBlog: FactorBlog }>()
const content = vue.ref<PostsOrPages>()

async function getContent(): Promise<void> {
  const r = await factorBlog.getGhostPosts({ limit: 20 })

  content.value = r
}

vue.onServerPrefetch(async () => {
  await getContent()
})

getContent().catch(error => console.error(error))
</script>

<template>
  <div class="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
    <div
      class="bg-theme-950 text-theme-0 border-theme-600 relative overflow-hidden rounded-lg border"
    >
      <div
        class="relative inset-0 z-30 flex h-full flex-col justify-center p-12"
      >
        <div class="font-cal text-4xl">
          About Supereon
        </div>
        <div class="my-8 text-xl">
          Supereon designs, builds, and supports AI in your business.
        </div>
        <div>
          <ElButton href="/">
            Learn More
          </ElButton>
        </div>
      </div>
      <ShootingStar />
    </div>
    <ContentBox
      v-for="(post, i) in content"
      :key="i"
      wrap-class="border-theme-600 border-theme-300 flex flex-col overflow-hidden rounded-lg h-full"
    >
      <div v-if="post.feature_image" class="shrink-0">
        <img
          class="h-48 w-full object-cover"
          :src="post.feature_image"
          alt=""
        >
      </div>
      <div class="flex flex-1 flex-col justify-between p-6">
        <div class="flex-1">
          <p v-if="post.primary_tag" class="text-theme-600 text-xs font-bold">
            <a href="#" class="uppercase hover:underline">
              {{ post.primary_tag?.name }}
            </a>
          </p>
          <router-link :to="`/blog/${post.slug}`" class="group mt-2 block">
            <p class="group-hover:text-primary-600 font-cal text-3xl">
              {{ post.title }}
            </p>
            <p class="text-theme-600 mt-3 text-base">
              {{ post.excerpt }}
            </p>
          </router-link>
        </div>
        <div class="mt-6 flex items-center">
          <div class="shrink-0">
            <a href="#">
              <span class="sr-only">{{ post.authors }}</span>

              <ElAvatar
                class="inline-block h-8 w-8 rounded-full"
                :url="post.primary_author?.profile_image ?? ''"
              />
            </a>
          </div>
          <div class="ml-3">
            <p class="text-theme-800 text-sm font-medium">
              <a href="#" class="hover:underline">{{
                post.primary_author?.name
              }}</a>
            </p>
            <div class="text-theme-500 flex space-x-1 text-sm">
              <time datetime="2020-03-16">{{
                dayjs(post.published_at).format("MMM DD, YYYY")
              }}</time>
              <span aria-hidden="true"> &middot; </span>
              <span> {{ post.reading_time }} min read </span>
            </div>
          </div>
        </div>
      </div>
    </ContentBox>
  </div>
</template>
