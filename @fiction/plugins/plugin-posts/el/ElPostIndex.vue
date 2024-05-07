<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import { managePostIndex } from '../utils'
import type { FictionPosts } from '..'
import type { Post } from '../post'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const posts = vue.shallowRef<Post[]>([])

const list = vue.computed(() => {
  return posts.value.map((p) => {
    return {
      ...p.toConfig(),
      key: p.postId,
      name: p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/post-edit?postId=${p.postId}`),
      media: p.image.value,
    }
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
  await load()
})
</script>

<template>
  <ElIndexGrid :list="list" :loading="loading">
    <template #item="{ item }">
      <div class="flex -space-x-0.5">
        <dt class="sr-only">
          Team Members
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
          name: 'Start Writing',
          href: card.link('/post-edit'),
          btn: 'primary',
          icon: 'i-heroicons-plus',
        }]"
      />
    </template>
  </ElIndexGrid>
</template>
