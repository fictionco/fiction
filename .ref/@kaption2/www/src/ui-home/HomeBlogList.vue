<script lang="ts" setup>
import { ref } from 'vue'
import type { PostEntryConfig } from '@factor/plugin-blog-engine'
import { factorBlog } from '..'
import PostList from '../blog/components/PostList.vue'

const content = ref<PostEntryConfig[]>([])

async function setContent(): Promise<void> {
  content.value = await factorBlog.getIndexContent()
}

setContent().catch(error => console.error(error))
</script>

<template>
  <div class="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
    <div class="relative mx-auto max-w-7xl">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Data-Driven Newsletter
        </h2>
        <p class="text-color-500 mx-auto mt-3 max-w-2xl text-xl sm:mt-4">
          Data-driven marketing for startups and technical leaders.
        </p>
      </div>
      <PostList />
    </div>
  </div>
</template>
