<script lang="ts" setup>
import ElSpinner from '@factor/ui/ElSpinner.vue'
import type {
  PostOrPage,
} from '@factor/api'
import {
  dayjs,
  standardDate,
  unhead,
  useService,
  vue,
} from '@factor/api'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import HighlightCode from '@factor/plugin-highlight-code/HighlightCode.vue'
import type { FactorEngine } from '..'

defineProps({
  settings: {
    type: Object as vue.PropType<{
      titlePrimary: string
      titleSecondary: string
    }>,
    required: true,
  },
})
const { factorEngine } = useService<{ factorEngine: FactorEngine }>()
const loading = vue.ref(false)
const post = vue.ref<PostOrPage>()

async function getContent(): Promise<void> {
  if (post.value)
    return

  loading.value = true

  post.value = await factorEngine.getCurrentPost()

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

vue.onMounted(async () => {
  await getContent()
})

unhead.useHead({
  title: vue.computed(() => {
    return (post.value?.title as string) ?? '(No Title)'
  }),
  meta: [
    {
      key: 'description',
      name: `description`,
      content: vue.computed(() => {
        return post.value?.excerpt ?? ''
      }),
    },
    {
      key: 'og:title',
      property: `og:title`,
      content: vue.computed(() => post.value?.title || ''),
    },
    {
      key: 'og:image',
      property: `og:image`,
      content: vue.computed(() => {
        return post.value?.imageUrl ?? ''
      }),
    },
    {
      property: `og:type`,
      content: 'article',
    },
    {
      property: 'article:published_time',
      content: dayjs(post.value?.publishedAt as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => post.value?.authorName || ''),
    },
  ],
})
</script>

<template>
  <div class="pl-content-width mx-auto my-16">
    <div
      v-if="loading"
      class="text-theme-300 flex items-center justify-center p-12"
    >
      <ElSpinner class="h-6 w-6" />
    </div>
    <div
      v-else
      class="mx-auto mb-10 max-w-[65rem] p-6 text-left md:text-center"
    >
      <div v-if="post?.category?.length" class="mb-8 space-x-2">
        <span class="italic opacity-70">in</span><span class="font-bold">{{ post.category?.join(", ") }}</span>
      </div>
      <div class="text-4xl font-bold lg:text-7xl">
        {{ post?.title }}
      </div>
      <div class="my-8 text-xl md:text-2xl">
        {{ post?.excerpt }}
      </div>

      <div v-if="post?.authorName" class="mt-6 inline-flex items-center space-x-4">
        <ElAvatar
          :email="post?.authorEmail"
          class="inline-block h-12 w-12 rounded-full bg-transparent ring-2 ring-white"
        />
        <div class="text-left">
          <div class="text-lg font-bold">
            {{ post?.authorName }}
          </div>
          <div class="text-xs">
            {{ standardDate(post?.publishedAt) }}
          </div>
        </div>
      </div>
    </div>
    <div class="featured-image text-center">
      <img class="inline-block" :src="post?.imageUrl">
    </div>
    <HighlightCode>
      <article
        class="entry mx-auto max-w-[45rem] px-4 pb-12 pt-16"
        v-html="post?.bodyHtml"
      />
    </HighlightCode>
  </div>
</template>

<style lang="less">
.entry {
  > p:first-of-type::first-letter {
    font-size: 200%;
    line-height: 1;
    text-transform: uppercase;
    margin-right: 0.06rem;
  }
}
</style>
