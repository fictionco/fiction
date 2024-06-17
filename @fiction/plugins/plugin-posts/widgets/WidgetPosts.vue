<script lang="ts" setup>
import { type ActionItem, dayjs, useService, vue } from '@fiction/core'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import type { FictionPosts, Post } from '..'
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
</script>

<template>
  <WidgetWrap :widget :actions>
    <div v-if="loading" class="p-12 flex justify-center text-theme-400 dark:text-theme-500">
      <ElSpinner class="size-8" />
    </div>
    <div v-else-if="!posts || posts.length === 0">
      <div class="p-6 text-center">
        <p class="text-theme-400">
          No posts found
        </p>
        <ElActions class="mt-4 gap-4 flex justify-center" :actions="actions" ui-size="sm" />
      </div>
    </div>
    <div v-else class="p-6">
      <RouterLink
        v-for="(post, i) in posts"
        :key="i"
        class="relative isolate flex gap-6 items-center hover:opacity-90 cursor-pointer"
        :to="card.link(`/post-edit?postId=${post.postId}`)"
      >
        <div>
          <div v-if="!post.image.value?.url" class="flex items-center justify-center size-12" :class="mediaClass">
            <div class="text-2xl i-tabler-pin" />
          </div>
          <ElImage v-else :class="mediaClass" :media="post.image.value" />
        </div>
        <div class="">
          <div v-if="post.publishAt.value || post.settings.updatedAt" class="flex items-center text-xs">
            <time class="text-theme-400">{{ dayjs(post.publishAt.value || post.settings.updatedAt).format('MMM DD, YYYY') }}</time>
          </div>
          <div class="group relative max-w-xl">
            <h3 class="text-xl mt-1 font-semibold hover:underline">
              <a href="#">
                <span class="absolute inset-0" />
                {{ post.title.value }}
              </a>
            </h3>
            <p class="text-sm leading-6 dark:text-theme-100">
              {{ post.excerpt.value || post.subTitle.value }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </WidgetWrap>
</template>
