<script lang="ts" setup>
import type { ActionButton, IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionPosts, Post } from '..'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { dayjs, useService, vue } from '@fiction/core'
import IndexItemList from '@fiction/ui/lists/IndexItemList.vue'
import { managePostIndex } from '..'

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

const actions: ActionButton[] = [
  {
    name: 'View All Posts',
    icon: 'i-tabler-list',
    href: props.card.link('/posts'),
  },
  {
    name: 'New Post',
    theme: 'primary',
    icon: 'i-tabler-pin',
    href: props.card.link('/posts?addNew=1'),
  },

]

const list = vue.computed<IndexItem[]>(() => {
  return posts.value.map((post) => {
    const media = post.media.value
    return {
      media,
      icon: 'i-tabler-pin',
      name: post.title.value || 'Untitled',
      desc: post.excerpt.value || post.subTitle.value,
      href: props.card.link(`/edit-post?postId=${post.postId}`),
      dateIso: post.publishAt.value || post.settings.updatedAt,
    }
  })
})
</script>

<template>
  <WidgetWrap :widget :actions>
    <IndexItemList :list :actions>
      <template #subTitle="{ item }">
        <div class="flex gap-2 flex-wrap leading-[1]">
          <div class="opacity-80">
            {{ item.desc || 'No excerpt' }}
          </div> &middot;
          <time v-if="item.dateIso" class="text-theme-400">{{ dayjs(item.dateIso).format('MMM DD, YYYY') }}</time>
        </div>
      </template>
    </IndexItemList>
  </WidgetWrap>
</template>
