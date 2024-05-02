<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import type { TablePostConfig } from '../schema'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const posts = vue.ref<TablePostConfig[]>([])

const list = vue.computed(() => {
  return posts.value.map((ext) => {
    return {
      ...ext,
      key: ext.postId,
    }
  })
})
</script>

<template>
  <ElIndexGrid :list="list">
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
