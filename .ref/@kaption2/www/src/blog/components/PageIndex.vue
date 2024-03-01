<script lang="ts" setup>
import { useMeta } from '@factor/api'
import PostList from './PostList.vue'

const title = 'Kaption Blog'
const description = 'Articles on CX analytics, insights, and feedback.'

useMeta({
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
  ],
})
</script>

<template>
  <div class="bg-white px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
    <div class="relative">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-3xl">
          {{ title }}
        </h2>
        <p class="mt-3 text-lg text-theme-500 sm:mt-4">
          {{ description }}
        </p>
      </div>
      <PostList />
    </div>
  </div>
</template>
