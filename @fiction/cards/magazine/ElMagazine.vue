<script lang="ts" setup>
import { unhead, useService, vue } from '@fiction/core'

import { Post } from '@fiction/posts'
import type { FictionPosts } from '@fiction/posts'
import type { Card } from '@fiction/site'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionPosts, fictionRouter } = useService<{ fictionPosts: FictionPosts }>()

const uc = vue.computed(() => props.card.userConfig.value || {})
const postIndex = vue.shallowRef<Post[]>([])
const singlePost = vue.shallowRef<Post | undefined>()
const nextPost = vue.shallowRef<Post | undefined>()
const loading = vue.ref(false)
const routeSlug = vue.computed(() => fictionRouter.params.value.itemId as string | undefined)

function getNextPost(args: { single?: Post, posts?: Post[] }) {
  const { single, posts = [] } = args
  if (!single)
    return undefined

  const index = posts.findIndex(p => p.slug.value === single.slug.value)
  if (index === -1)
    return undefined

  return posts[index + 1] || posts[index - 1] || undefined
}

async function loadGlobal() {
  loading.value = true
  const orgId = props.card.site?.settings.orgId

  if (!orgId)
    throw new Error('No fiction orgId found')

  if (routeSlug.value) {
    singlePost.value = await fictionPosts.getPost({ slug: routeSlug.value, orgId })
    nextPost.value = getNextPost({ single: singlePost.value, posts: postIndex.value })
  }
  else {
    postIndex.value = await fictionPosts.getPostIndex({ limit: 5, orgId })
  }

  loading.value = false
}

async function loadInline() {
  const ps = uc.value.posts?.posts || []
  postIndex.value = ps.map(p => new Post({ fictionPosts, ...p }))

  if (routeSlug.value) {
    const p = ps.find(p => p.slug === routeSlug.value)
    singlePost.value = new Post({ fictionPosts, ...p })
    nextPost.value = getNextPost({ single: singlePost.value, posts: ps.map(p => new Post({ fictionPosts, ...p })) })
  }
}

async function load() {
  if (uc.value.posts?.format === 'local') {
    await loadInline()
  }
  else {
    await loadGlobal()
  }
}

vue.onServerPrefetch(async () => {
  await load()
})

vue.onMounted(async () => {
  vue.watch(() => routeSlug.value, async () => {
    await load()
  }, { immediate: true })
})

const head = vue.computed(() => {
  const uc = singlePost.value?.userConfig.value
  const single = singlePost.value
  return {
    title: uc?.seo?.title || single?.title.value || 'Untitled Post',
    description: uc?.seo?.description || single?.subTitle.value || 'No description',
  }
})

// render as usual for main page
if (routeSlug.value) {
  unhead.useHead({
    title: () => head.value.title,
    meta: [{ name: `description`, content: () => head.value.description }],
  })
}
</script>

<template>
  <div>
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <ElMagazineSingle v-if="routeSlug" :card="card" :loading="loading" :post="singlePost" :next-post="nextPost" />
      <ElMagazineIndex v-else :card="card" :loading="loading" :post-index="postIndex" />
    </transition>
  </div>
</template>
