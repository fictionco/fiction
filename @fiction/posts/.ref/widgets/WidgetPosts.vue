<script lang="ts" setup>
import type { ActionButton, ColorThemeUser, IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionPosts, Post } from '..'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { dayjs, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
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
      caller: 'WidgetPosts',
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

const buttons: ActionButton[] = [
  {
    label: 'View Posts',
    theme: 'default',
    icon: 'i-tabler-list',
    href: props.card.link('/posts'),
  },
]

function formatDate(dateIso?: string): string {
  if (!dateIso)
    return ''
  return dayjs(dateIso).fromNow()
}

function getPostType(post: Post): string {
  return post.emailConfig.value ? 'Newsletter' : 'Article'
}

function getPostTypeTheme(type: string): ColorThemeUser {
  switch (type) {
    case 'Newsletter': return 'emerald'
    case 'Article': return 'blue'
    default: return 'gray'
  }
}

const list = vue.computed<(IndexItem & { meta: { type: string, typeTheme: ColorThemeUser, views: number, likes: number } })[]>(() => {
  return posts.value.map((post) => {
    const postType = getPostType(post)
    return {
      media: post.media.value,
      icon: { class: 'i-tabler-pencil' },
      label: post.title.value || 'Untitled',
      description: post.subTitle.value,
      href: props.card.link(`/edit-post?postId=${post.postId}`),
      dateIso: post.publishAt.value || post.settings.updatedAt,
      meta: {
        type: postType,
        typeTheme: getPostTypeTheme(postType),
        views: Math.floor(Math.random() * 200),
        likes: Math.floor(Math.random() * 30),
      },
    }
  })
})
</script>

<template>
  <WidgetWrap :widget :buttons>
    <div class="@container/posts">
      <!-- Loading state -->
      <div v-if="loading" class="p-4 flex justify-center">
        <ElSpinner class="text-theme-400 size-6" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!posts.length" class="p-4 text-center">
        <p class="text-theme-500 dark:text-theme-400 text-sm">
          No posts yet
        </p>
        <XButtonList
          class="mt-3 gap-2 flex justify-center"
          :buttons="buttons"
        />
      </div>

      <!-- Posts list -->
      <div v-else class="divide-y divide-theme-100 dark:divide-theme-700/70">
        <XLink
          v-for="(item, i) in list"
          :key="i"
          class="group p-5 flex items-start gap-3 hover:bg-theme-50 dark:hover:bg-theme-700/50 transition-colors"
          :href="item.href"
        >
          <!-- Content -->
          <div class="flex-1 min-w-0 space-y-4">
            <!-- Post header with title -->
            <div>
              <div class="flex">
                <h3 class="@[28rem]/posts:text-xl text-base font-semibold text-theme-900 dark:text-theme-100 truncate group-hover:text-theme-700 dark:group-hover:text-theme-300 transition-colors">
                  {{ item.label }}
                </h3>
              </div>

              <!-- Description - only shown on larger containers -->
              <p
                v-if="item.description"
                class="@[32rem]/posts:block hidden text-sm @[28rem]/posts:text-base text-theme-600 dark:text-theme-400 line-clamp-2"
              >
                {{ item.description }}
              </p>
            </div>

            <!-- Metrics row -->
            <div class="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-theme-500 dark:text-theme-500">
              <XButton design="ghost" theme="primary" size="sm">
                {{ item.meta.type }}
              </XButton>

              <span class="flex items-center gap-1">
                <i class="i-tabler-eye" />
                {{ item.meta.views }}
              </span>

              <span class="flex items-center gap-1">
                <i class="i-tabler-thumb-up" />
                {{ item.meta.likes }}
              </span>

              <span class="flex items-center gap-1">
                <i class="i-tabler-clock" />
                {{ formatDate(item.dateIso) }}
              </span>
            </div>
          </div>

          <!-- Right side content - image and badge for smaller viewports -->
          <div class="flex flex-col items-end gap-2">
            <!-- Type badge - shown only on smaller screens -->
            <span
              class="@[32rem]/posts:hidden inline-flex px-1.5 py-0.5 rounded-sm text-xs"
              :class="{
                'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400': item.meta.type === 'Newsletter',
                'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400': item.meta.type === 'Article',
              }"
            >
              {{ item.meta.type }}
            </span>

            <!-- Image with appropriate sizing based on container -->
            <ElIndexItemMedia
              v-if="item.media"
              class="@[32rem]/posts:w-20 @[32rem]/posts:h-20 w-16 h-16 rounded overflow-hidden"
              :media="item.media"
              :icon="!item.media?.url ? item.icon : undefined"
              theme="theme"
            />
          </div>
        </XLink>
      </div>
    </div>
  </WidgetWrap>
</template>
