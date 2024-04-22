<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

const posts = vue.ref([{
  postId: '1',
  name: 'Hello World',
  desc: 'This is a test post',
  authors: [{ email: 'arpowers@gmail.com' }],
}])

const list = vue.computed(() => {
  return posts.value.map((ext) => {
    return {
      ...ext,
      key: ext.postId,
    }
  })
})

const boxClass = 'dark:bg-theme-975 hover:bg-theme-50 dark:hover:bg-theme-700 px-6 border border-theme-200/60 dark:border-theme-600 rounded-xl'
</script>

<template>
  <ElIndexGrid v-slot="{ item }" :list="list">
    <div class="flex -space-x-0.5">
      <dt class="sr-only">
        Team Members
      </dt>
      <dd v-for="(member, ii) in item.authors" :key="ii">
        <ElAvatar class="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white" :email="member.email" />
      </dd>
    </div>
  </ElIndexGrid>
</template>
