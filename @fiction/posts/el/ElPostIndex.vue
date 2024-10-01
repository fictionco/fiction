<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { managePostIndex } from '../utils'
import ElPostStart from './ElPostStart.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionRouter, fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const posts = vue.shallowRef<Post[]>([])

const showCreateModal = vue.ref(false)

vue.onMounted(() => {
  vue.watchEffect(() => {
    if (fictionRouter.query.value.addNew) {
      showCreateModal.value = true
      fictionRouter.query.value = { }
    }
  })
})

const list = vue.computed<IndexItem[]>(() => {
  return posts.value.map((p) => {
    return {
      ...p.toConfig(),
      key: p.postId,
      name: p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/edit-post?postId=${p.postId}`),
      media: p.media.value,
    } as IndexItem
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  posts.value = await managePostIndex({ fictionPosts, params: createParams })
  loading.value = false
}

vue.onMounted(async () => {
  vue.watch(() => fictionPosts.cacheKey.value, load, { immediate: true })
})
</script>

<template>
  <div>
    <ElIndexGrid
      :list="list"
      :loading="loading"
      :actions="[{
        name: 'Create Post',
        icon: 'i-tabler-plus',
        theme: 'primary',
        onClick: () => (showCreateModal = true),
        rounding: 'full',
        testId: 'createPostButtonTop',
      }]"
    >
      <template #item="{ item }">
        <div class="flex -space-x-0.5">
          <dt class="sr-only">
            Authors
          </dt>
          <dd v-for="(member, ii) in item.authors" :key="ii">
            <ElAvatar class="h-6 w-6 rounded-full bg-theme-50 ring-2 ring-white" :email="member.email" />
          </dd>
        </div>
      </template>
      <template #zero>
        <ElZeroBanner
          title="Create your first post"
          description="Posts are the building blocks of your marketing efforts. Use them for newsletters, social media clips, and more."
          icon="i-tabler-pin"
          :actions="[{
            name: 'Create Post',
            onClick: () => (showCreateModal = true),
            theme: 'primary',
            icon: 'i-heroicons-plus',
            testId: 'createPostButton',
          }]"
        />
      </template>
    </ElIndexGrid>
    <ElPostStart v-model:vis="showCreateModal" :card />
  </div>
</template>
