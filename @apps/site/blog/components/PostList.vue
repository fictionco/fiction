<template>
  <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
    <div
      v-for="(post, i) in content"
      :key="i"
      class="flex flex-col rounded-lg border border-x-200 overflow-hidden"
    >
      <div class="shrink-0">
        <img class="h-48 w-full object-cover" :src="post.postImage" alt="" />
      </div>
      <div class="flex-1 bg-white p-6 flex flex-col justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-indigo-600">
            <a
              v-for="(type, ii) in post.type"
              :key="ii"
              href="#"
              class="uppercase hover:underline"
            >
              {{ type }}
            </a>
          </p>
          <router-link :to="post.path" class="block mt-2">
            <p class="text-xl font-semibold">
              {{ post.title }}
            </p>
            <p class="mt-3 text-base text-normal-500">
              {{ post.excerpt || post.description }}
            </p>
          </router-link>
        </div>
        <div class="mt-6 flex items-center">
          <div class="shrink-0">
            <a href="#">
              <span class="sr-only">{{ post.authorName }}</span>

              <ElAvatar
                class="inline-block h-8 w-8 rounded-full"
                :email="post.authorEmail"
              />
            </a>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-900">
              <a href="#" class="hover:underline">{{ post.authorName }}</a>
            </p>
            <div class="flex space-x-1 text-sm text-slate-500">
              <time datetime="2020-03-16">{{
                dayjs(post.publishDate).format("MMM DD, YYYY")
              }}</time>
              <span aria-hidden="true"> &middot; </span>
              <span> {{ post.readingMinutes }} min read </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ElAvatar from "@factor/ui/ElAvatar.vue"
import dayjs from "dayjs"
import { ref } from "vue"
import { getIndexContent, PostEntryConfig } from "@factor/plugin-blog-engine"

const content = ref<PostEntryConfig[]>([])

const setContent = async () => {
  content.value = await getIndexContent()

  return
}

setContent().catch((error) => console.error(error))
</script>
