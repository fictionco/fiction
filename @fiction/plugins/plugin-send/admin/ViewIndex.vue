<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import type { FictionPosts, Post } from '@fiction/plugin-posts'
import { managePostIndex } from '@fiction/plugin-posts'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const posts = vue.shallowRef<Post[]>([])

const list = vue.computed<IndexItem[]>(() => {
  return posts.value.map((p) => {
    return {
      ...p.toConfig(),
      key: p.postId,
      name: p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/email-edit?emailId=${p.postId}`),
      media: p.image.value,
    } as IndexItem
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  posts.value = await managePostIndex({ fictionPosts: service.fictionPosts, params: createParams })
  loading.value = false
}

vue.onMounted(async () => {
  vue.watch(() => service.fictionPosts.cacheKey.value, load, { immediate: true })
})

const href = props.card.link('/email-edit')
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElIndexGrid list-title="Emails" :list="list" :loading="loading" :actions="[{ name: 'New Email', icon: 'i-tabler-plus', btn: 'primary', href }]">
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
          title="Create Your First Email Campaign"
          description="Quickly send a message to your subscribers."
          icon="i-tabler-pin"
          :actions="[{ name: 'Start', href, btn: 'primary', icon: 'i-heroicons-plus' }]"
        />
      </template>
    </ElIndexGrid>
  </div>
</template>
