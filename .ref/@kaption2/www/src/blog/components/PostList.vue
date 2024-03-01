<script lang="ts" setup>
import { ref } from 'vue'
import type { PostEntryConfig } from '@factor/plugin-blog-engine'
import { useSiteService } from '../../inject'

const { factorBlog } = useSiteService()

const content = ref<PostEntryConfig[]>([])

async function setContent(): Promise<void> {
  content.value = await factorBlog.getIndexContent()
}

setContent().catch(error => console.error(error))
</script>

<template>
  <div class="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
    <div
      v-for="(post, i) in content"
      :key="i"
      class="border-x-200 flex flex-col overflow-hidden rounded-lg border"
    >
      <div class="flex flex-1 flex-col justify-between bg-white p-6">
        <div class="flex-1">
          <p class="text-primary-600 text-sm font-bold">
            <a
              v-for="(type, ii) in post.type"
              :key="ii"
              href="#"
              class="uppercase hover:underline"
            >
              {{ type }}
            </a>
          </p>
          <router-link :to="post.path || '/'" class="mt-2 block">
            <p class="text-xl font-bold">
              {{ post.title }}
            </p>
            <p class="mt-3 text-base text-theme-500">
              {{ post.excerpt || post.description }}
            </p>
          </router-link>
        </div>
        <div class="mt-6 flex items-center">
          <div class="flex space-x-1 text-sm text-theme-400">
            <span> {{ post.readingMinutes }} min read </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
