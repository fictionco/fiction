<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'

import type { FictionPosts } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { unhead, useService, vue } from '@fiction/core'
import { Post } from '@fiction/posts'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const uc = vue.computed(() => card.userConfig.value || {})
const posts = vue.shallowRef<Post[]>([])
const singlePost = vue.shallowRef<Post | undefined>()
const nextPost = vue.shallowRef<Post | undefined>()
const loading = vue.ref(false)
const routeSlug = vue.computed(() => card.site?.siteRouter.params.value.itemId as string | undefined)

const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: uc.value.posts?.limit || 10,
  count: 0,
  order: 'desc',
  orderBy: 'dateAt',
})

function updateIndexMeta(newMeta: IndexMeta) {
  indexMeta.value = newMeta
  // Trigger re-fetching of posts with the new offset
  loadPosts()
}

async function loadPosts() {
  if (uc.value.posts?.format === 'local') {
    await loadLocal()
  }
  else {
    await loadGlobal()
  }
}

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
  const orgId = card.site?.settings.orgId

  if (!orgId)
    throw new Error('No fiction orgId found')

  if (routeSlug.value) {
    singlePost.value = await fictionPosts.getPost({ slug: routeSlug.value, orgId })
    nextPost.value = getNextPost({ single: singlePost.value, posts: posts.value })
  }
  else {
    const r = await fictionPosts.getPostIndex({ limit: 5, orgId })
    posts.value = r.posts
    indexMeta.value = { ...indexMeta.value, ...r.indexMeta }
  }

  loading.value = false
}

async function loadLocal() {
  const common = { fictionPosts, card, sourceMode: 'local' } as const
  const ps = uc.value.posts?.posts || []
  posts.value = ps.map((p, i) => new Post({ ...common, ...p, localSourcePath: `posts.posts.${i}` }))

  if (routeSlug.value) {
    const p = ps.find(p => p.slug === routeSlug.value)
    const localSourcePath = `posts.posts.${ps.findIndex(p => p.slug === routeSlug.value)}`
    singlePost.value = new Post({ ...common, ...p, localSourcePath })
    nextPost.value = getNextPost({ single: singlePost.value, posts: ps.map(p => new Post({ ...common, ...p })) })
  }
  else {
    const { offset = 0, limit = 10 } = indexMeta.value
    const start = offset
    const end = offset + limit
    posts.value = ps.slice(start, end).map((p, i) => new Post({ ...common, ...p, localSourcePath: `posts.posts.${i + start}` }))
    indexMeta.value = {
      ...indexMeta.value,
      count: ps.length,
      offset,
      limit,
    }
  }
}

vue.onServerPrefetch(async () => {
  await loadPosts()
})

vue.onMounted(async () => {
  vue.watch(() => [routeSlug.value, uc.value.posts?.format], async () => {
    await loadPosts()
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
  <div :data-route-slug="routeSlug">
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <ElMagazineSingle
        v-if="routeSlug"
        :key="routeSlug"
        :card="card"
        :loading="loading"
        :post="singlePost"
        :next-post="nextPost"
      />
      <ElMagazineIndex
        v-else
        :card="card"
        :loading="loading"
        :posts="posts"
        :index-meta="indexMeta"
        @update:index-meta="updateIndexMeta"
      />
    </transition>
  </div>
</template>
