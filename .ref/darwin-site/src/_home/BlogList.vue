<template>
  <div class="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="relative max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl tracking-tight font-extrabold sm:text-4xl">
          Data-Driven Newsletter
        </h2>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-color-500 sm:mt-4">
          Data-driven marketing for startups and technical leaders.
        </p>
      </div>
      <PostList />
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostList from "../blog/components/PostList.vue"
import { ref } from "vue"
import { getIndexContent, PostEntryConfig } from "@factor/plugin-blog-engine"

const content = ref<PostEntryConfig[]>([])

const setContent = async () => {
  content.value = await getIndexContent()

  return
}

setContent()
</script>
