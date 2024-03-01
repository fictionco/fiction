<script lang="ts" setup>
import { useMeta, useService } from '@factor/api'
import type { FactorBlog } from '@factor/plugin-blog-engine'
import PageWrap2 from '../../el/PageWrap2.vue'
import PostList from './PostList.vue'

const { factorBlog } = useService<{ factorBlog: FactorBlog }>()

const title = 'Fiction Blog'
const description = 'Latest updates on generative AI'

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
  <PageWrap2>
    <div class="mx-auto max-w-screen-xl">
      <div class="px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div class="relative">
          <div class=" ">
            <h2 class="font-cal text-3xl font-extrabold tracking-tight">
              {{ title }}
            </h2>
            <p class="mt-3 text-xl sm:mt-4">
              {{ description }}
            </p>
          </div>
          <PostList />
        </div>
      </div>
    </div>
  </PageWrap2>
</template>
