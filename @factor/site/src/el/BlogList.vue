<template>
  <div class="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
    <div class="relative mx-auto max-w-7xl">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Updates
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-xl text-slate-500 sm:mt-4">
          Latest updates on Factor.
        </p>
      </div>
      <PostList />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import type { PostEntryConfig } from "@factor/plugin-blog-engine"
import { useFactorService } from "../inject"
import PostList from "../../blog/components/PostList.vue"

const { factorBlog } = useFactorService()
const content = vue.ref<PostEntryConfig[]>([])

const setContent = async (): Promise<void> => {
  content.value = await factorBlog.getIndexContent()

  return
}

setContent().catch((error) => console.error(error))
</script>
