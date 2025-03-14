<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { useService, vue } from '@fiction/core'
import { loadPosts } from '@fiction/posts/utils/post'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(true)
const posts = vue.shallowRef<Post[]>([])
const singlePost = vue.shallowRef()
const nextPost = vue.shallowRef()
const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: card.userConfig.value.posts?.limit || 12,
  count: 0,
})

const viewId = vue.computed(() => card.site?.siteRouter.params.value.viewId as string)
const routeSlug = vue.computed(() => card.site?.siteRouter.params.value.itemId as string)
const uc = vue.computed(() => card.userConfig.value || {})

async function fetchPosts() {
  if (!fictionPosts)
    return

  loading.value = true
  try {
    const result = await loadPosts({
      fictionPosts,
      card,
      postConfig: uc.value.posts || {},
      routeSlug: routeSlug.value,
      indexMeta: indexMeta.value,
    })

    posts.value = result.posts
    indexMeta.value = result.indexMeta
    singlePost.value = result.singlePost
    nextPost.value = result.nextPost
  }
  finally {
    loading.value = false
  }
}

function updateIndexMeta(newMeta: IndexMeta) {
  indexMeta.value = newMeta
  fetchPosts()
}

vue.onMounted(() => {
  vue.watch(() => [routeSlug.value, uc.value.posts?.format], fetchPosts, { immediate: true })
})

vue.onServerPrefetch(fetchPosts)
</script>

<template>
  <div
    :class="card.classes.value.contentWidth"
    :data-post-format="uc.posts?.format"
    :data-post-limit="uc.posts?.limit"
    :data-item-id="routeSlug"
    :data-view-id="card.site?.siteRouter.params.value.viewId"
  >
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <div v-if="loading" class="flex justify-center py-12 h-[80vh]">
        <ElSpinner class="size-8 text-theme-500" />
      </div>

      <template v-else-if="routeSlug">
        <ElMagazineSingle
          v-if="singlePost"
          :key="routeSlug"
          :card="card"
          :post="singlePost"
          :next-post="nextPost"
          :loading
        />
        <El404
          v-else
          title="Post Not Found"
          sub-title="We couldn't find the post at this location"
          :buttons="[{
            label: 'All Posts',
            icon: 'i-tabler-article',
            href: card.link(`/${viewId}`),
            theme: 'primary',
          }]"
        />
      </template>

      <template v-else>
        <ElMagazineIndex
          v-if="posts.length"
          :card="card"
          :posts="posts"
          :index-meta="indexMeta"
          :loading
          @update:index-meta="updateIndexMeta"
        />

        <El404
          v-else-if=" !posts.length"
          title="No Posts Available"
          sub-title="Check back later for new content"
        />
      </template>
    </transition>
  </div>
</template>
