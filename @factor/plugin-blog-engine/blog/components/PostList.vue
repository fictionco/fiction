<template>
  <div class="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
    <div
      v-for="(post, i) in content"
      :key="i"
      class="border-x-200 flex flex-col overflow-hidden rounded-lg border"
    >
      <div class="shrink-0">
        <img class="h-48 w-full object-cover" :src="post.postImage" alt="" />
      </div>
      <div class="flex flex-1 flex-col justify-between bg-white p-6">
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
          <router-link :to="post.path" class="mt-2 block">
            <p class="text-xl font-semibold">
              {{ post.title }}
            </p>
            <p class="text-normal-500 mt-3 text-base">
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
import { dayjs, vue } from "@factor/api"
import { blogPlugin } from ".."
import { PostEntryConfig } from "../../types"

const content = vue.ref<PostEntryConfig[]>([])

const setContent = async (): Promise<void> => {
  content.value = await blogPlugin.getIndexContent()

  return
}

setContent().catch((error) => console.error(error))
</script>
