<script lang="ts" setup>
import { unhead, useService, vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import type { FictionPosts, Post } from '@fiction/plugin-posts'
import ElMagazineIndex from './ElMagazineIndex.vue'
import ElMagazineSingle from './ElMagazineSingle.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const postIndex = vue.shallowRef<Post[]>([])
const singlePost = vue.shallowRef<Post | undefined>()
const loading = vue.ref(false)
const routeSlug = vue.computed(() => service.fictionRouter.params.value.itemId as string | undefined)

async function load() {
  loading.value = true
  const orgId = props.card.site?.settings.orgId

  if (!orgId)
    throw new Error('No fiction orgId found')

  if (routeSlug.value)
    singlePost.value = await service.fictionPosts.getPost({ slug: routeSlug.value, orgId })
  else
    postIndex.value = await service.fictionPosts.getPostIndex({ limit: 5, orgId })

  loading.value = false
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
  if (routeSlug.value) {
    const uc = singlePost.value?.userConfig.value
    const single = singlePost.value
    return {
      title: uc?.seoTitle || single?.title.value || 'Untitled Post',
      description: uc?.seoDescription || single?.subTitle.value || 'No description',
    }
  }
  else {
    return { title: 'Magazine', description: 'No description' }
  }
})

unhead.useHead({
  title: () => head.value.title,
  meta: [{ name: `description`, content: () => head.value.description }],
})
</script>

<template>
  <div>
    <ElMagazineSingle v-if="routeSlug" :card="card" :loading="loading" :post="singlePost" />
    <ElMagazineIndex v-else :card="card" :loading="loading" :post-index="postIndex" />
  </div>
</template>
