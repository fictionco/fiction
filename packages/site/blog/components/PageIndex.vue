<template>
  <div class="bg-white px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
    <div class="relative">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>
        <p class="mt-3 text-xl text-slate-500 sm:mt-4">
          {{ description }}
        </p>
      </div>
      <PostList></PostList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMeta } from "@factor/api"
import PostList from "./PostList.vue"
const title = "Blog"

const description = "Digital, Marketing, and Business Analytics Insights"

useMeta({
  title: title,
  meta: [
    {
      name: "description",
      content: description,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
  ],
})
</script>
