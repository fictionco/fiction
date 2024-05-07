<script lang="ts" setup>
import { useService, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import AdminEditItem from '@fiction/admin/AdminEditItem.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import InputDate from '@fiction/ui/inputs/InputDate.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
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
const publishItemSelected = vue.ref<string | undefined>()

const vis = vue.ref(false)
async function showPublishModal() {
  vis.value = true
}

async function publish(mode: 'publish' | 'schedule' = 'publish') {
  if (!post.value)
    return
  sending.value = 'publish'

  // min 1 second for UX reasons
  await Promise.all([waitFor(1000), post.value.save({ mode })])

  sending.value = ''
  vis.value = false
  publishItemSelected.value = undefined
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
            :to="card.link('/posts')"
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
          :loading="sending === 'publish'"
          class="min-w-36"
          icon="i-tabler-arrow-big-up-lines"
          size="md"
          @click.stop.prevent="post?.status.value === 'draft' ? showPublishModal() : publish()"
        >
          {{ post?.status.value === 'draft' ? 'Publish Post' : 'Update Post' }}
        </ElButton>
      </template>
      <template #default>
        <div><ElPostEditor :post="post" /></div>
      </template>
    </AdminEditItem>
    <ElModal v-model:vis="vis" modal-class="max-w-screen-md p-24 ">
      <div v-if="post" class="relative max-w-xl mx-auto">
        <div class="text-center mb-8 ">
          <div class="x-font-title text-xl font-bold antialiased dark:text-theme-0 mb-4 text-balance">
            <template v-if="publishItemSelected === 'publish'">
              Publish Now
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              Select Publication Time
            </template>
            <template v-else>
              This post is in draft.
            </template>
          </div>
          <div class="text-base font-medium dark:text-theme-300 text-balance">
            <template v-if="publishItemSelected === 'publish'">
              This action will publish now the post and syndicate it to your audience (based on your settings).
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              This will schedule the post to be published at the selected time.
            </template>
            <template v-else>
              Publishing will make it live and syndicate it to your audience (based on your settings).
            </template>
          </div>
        </div>
        <div v-if="!publishItemSelected" class="space-y-6">
          <div class="flex justify-center gap-6">
            <ElButton size="md" icon="i-tabler-calendar-bolt" @click="publishItemSelected = 'schedule'">
              Schedule Publication
            </ElButton>
            <ElButton size="md" btn="primary" icon="i-tabler-arrow-big-up-lines" :loading="sending === 'publish'" @click="publish()">
              Publish Now
            </ElButton>
          </div>
        </div>

        <div v-else-if="publishItemSelected === 'schedule'" class="mx-auto max-w-sm">
          <ElForm class=" space-y-6" @submit="publish('schedule')">
            <InputDate v-model="post.publishAt.value" :include-time="true" required date-mode="future" />
            <div class="flex justify-center gap-6">
              <ElButton v-if="publishItemSelected" size="md" @click="publishItemSelected = ''">
                &larr; Back
              </ElButton>
              <ElButton size="md" btn="primary" icon="i-tabler-calendar-bolt" type="submit" :loading="sending === 'publish'">
                Schedule Publication
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </ElModal>
  </div>
</template>
