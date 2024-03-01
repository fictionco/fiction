<script lang="ts" setup>
import { useMeta, useService } from '@factor/api'
import type { FactorBlog } from '@factor/plugin-blog-engine'
import PageWrap from '../../PageWrap.vue'
import PostList from './PostList.vue'

const { factorBlog } = useService<{ factorBlog: FactorBlog }>()

const title = 'Supereon Blog'
const description = 'Latest on business and technology.'

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
  <PageWrap>
    <div class="mx-auto max-w-screen-xl">
      <div class="px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div class="relative">
          <div class="text-theme-0">
            <h2
              class="font-cal text-3xl font-extrabold tracking-tight sm:text-6xl"
            >
              {{ title }}
            </h2>
            <p class="text-theme-100 mt-3 text-2xl sm:mt-4">
              {{ description }}
            </p>
          </div>
          <PostList />
        </div>
      </div>
    </div>
  </PageWrap>
</template>
