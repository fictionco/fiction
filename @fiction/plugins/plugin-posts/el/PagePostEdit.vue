<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import AdminEditItem from '@fiction/admin/AdminEditItem.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import type { Post } from '../post'
import { managePost } from '../utils'
import type { FictionPosts } from '..'
import { postEditController } from './tools'
import ElPostEditor from './ElPostEditor.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(true)
const sending = vue.ref()
const post = vue.shallowRef<Post | undefined>()

async function publish() {
  if (!post.value)
    return
  sending.value = 'save'
  await post.value.save('publish')
  sending.value = ''
}

async function load() {
  loading.value = true
  const r = service.fictionRouter
  const postId = r.query.value.postId as string | undefined

  if (!postId) {
    const createParams = { _action: 'create', fields: { } } as const
    post.value = await managePost({ fictionPosts: service.fictionPosts, params: createParams })

    r.replace({ query: { postId: post.value?.postId } })
  }
  else {
    const editParams = { _action: 'get', postId, loadDraft: true } as const
    post.value = await managePost({ fictionPosts: service.fictionPosts, params: editParams })
  }
  loading.value = false
}

vue.onMounted(async () => {
  await load()
})
</script>

<template>
  <div>
    <AdminEditItem :tool-props="{ post }" :controller="postEditController" :loading="loading">
      <template #headerLeft>
        <ElButton btn="default" :href="card.link('/')">
          <div class="i-tabler-home text-lg" />
        </ElButton>
        <div class="flex space-x-1 font-medium">
          <RouterLink
            class="text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/')"
          >
            <span class="i-tabler-pin text-xl inline-block dark:text-theme-500" />
            <span>Edit Post</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XTextBase v-if="post" v-model="post.title.value" :is-editable="true" />
        </div>
      </template>
      <template #headerRight>
        <ElButton
          btn="default"
          href="/"
          target="_blank"
          @click.prevent=""
        >
          <svg class="h-1.5 w-1.5 mr-2" :class="post?.isDirty.value ? 'fill-orange-500' : 'fill-green-500'" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx="3" cy="3" r="3" />
          </svg>
          {{ post?.isDirty.value ? 'Syncing' : 'Draft Saved' }}
        </ElButton>
        <ElButton
          btn="primary"
          :loading="sending === 'save'"
          class="min-w-36"
          :icon="post?.settings.isPublished ? 'i-tabler-arrow-big-up-lines' : 'i-tabler-calendar-bolt'"
          size="md"
          @click.prevent="publish()"
        >
          {{ post?.settings.isPublished ? 'Publish Changes' : 'Schedule Publication' }}
        </ElButton>
      </template>
      <template #default>
        <div><ElPostEditor :post="post" /></div>
      </template>
    </AdminEditItem>
  </div>
</template>
