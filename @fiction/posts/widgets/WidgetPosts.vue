<script lang="ts" setup>
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { dayjs, useService, vue } from '@fiction/core'
import IndexItemList from '@fiction/ui/lists/IndexItemList.vue'
import type { ActionItem, IndexItem, MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import { managePostIndex } from '..'
import type { FictionPosts, Post } from '..'

type SubscriberWidget = FictionPosts['widgets']['recentPosts']

const props = defineProps({
  widget: { type: Object as vue.PropType<SubscriberWidget>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(false)
const posts = vue.shallowRef<Post[]>([])

vue.onMounted(async () => {
  loading.value = true

  try {
    const data = await managePostIndex({
      fictionPosts: service.fictionPosts,
      params: { _action: 'list', limit: 5 },
    })

    if (data) {
      posts.value = data
    }
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
})

const mediaClass = `size-14 ring-2 ring-theme-200/50 bg-theme-50 dark:bg-theme-700 dark:text-theme-0 dark:ring-theme-0 rounded-lg overflow-hidden text-theme-500/50`

const actions: ActionItem[] = [
  {
    name: 'View all posts',
    icon: 'i-tabler-layout-grid',
    href: props.card.link('/posts'),
  },
  {
    name: 'New Post',
    btn: 'primary',
    icon: 'i-tabler-pin',
    href: props.card.link('/post-edit'),
  },

]

const list = vue.computed<IndexItem[]>(() => {
  return posts.value.map((post) => {
    const media = post.media.value as MediaObject
    return {
      media,
      icon: 'i-tabler-pin',
      name: post.title.value || 'Untitled',
      desc: post.excerpt.value || post.subTitle.value,
      href: props.card.link(`/post-edit?postId=${post.postId}`),
      dateIso: post.publishAt.value || post.settings.updatedAt,
    }
  })
})
</script>

<template>
  <WidgetWrap :widget :actions>
    <IndexItemList :list :actions>
      <template #details="{ item }">
        <time v-if="item.dateIso" class="text-theme-400">{{ dayjs(item.dateIso).format('MMM DD, YYYY') }}</time>
      </template>
    </IndexItemList>
  </WidgetWrap>
</template>
