<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
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

const vis = vue.ref(false)
async function showPublishModal() {
  vis.value = true
}

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

const publishItemSelected = vue.ref<string | undefined>()
const publishMenu: ListItem[] = [
  { name: 'Publish Now...', value: 'publish', icon: 'i-tabler-arrow-big-up-lines' },
  { name: 'Schedule Publication...', value: 'schedule', icon: 'i-tabler-calendar-bolt' },
]
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
          @click.stop.prevent="showPublishModal()"
        >
          {{ post?.settings.isPublished ? 'Publish Changes' : 'Schedule Publication' }}
        </ElButton>
      </template>
      <template #default>
        <div><ElPostEditor :post="post" /></div>
      </template>
    </AdminEditItem>
    <ElModal v-model:vis="vis" modal-class="max-w-screen-md p-24 ">
      <div class="relative">
        <div class="text-center mb-8">
          <div class="x-font-title text-xl font-bold antialiased dark:text-theme-0 mb-4">
            <template v-if="publishItemSelected === 'publish'">
              Publish Now
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              Select Publication Time
            </template>
            <template v-else>
              Select a Publishing Option
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
              Choose how you would like to publish this post.
            </template>
          </div>
        </div>
        <div v-if="!publishItemSelected" class="space-y-6">
          <div class="flex justify-center gap-6">
            <ElButton
              v-for="(item, i) in publishMenu"
              :key="i"
              size="md"
              btn="theme"
              class="min-w-[230px]"
              :icon="item.icon"
              @click="publishItemSelected = (item.value as string)"
            >
              {{ item.name }}
            </ElButton>
          </div>
        </div>
        <div v-else-if="publishItemSelected === 'publish'">
          <div class="flex justify-center gap-6">
            <ElButton v-if="publishItemSelected" size="md" @click="publishItemSelected = ''">
              &larr; Back
            </ElButton>
            <ElButton size="md" btn="primary" icon="i-tabler-arrow-big-up-lines">
              Go Live
            </ElButton>
          </div>
        </div>

        <div v-else-if="publishItemSelected === 'schedule'" class="mx-auto max-w-sm">
          <ElForm class=" space-y-6">
            <InputDate :include-time="true" required />
            <div class="flex justify-center gap-6">
              <ElButton v-if="publishItemSelected" size="md" @click="publishItemSelected = ''">
                &larr; Back
              </ElButton>
              <ElButton size="md" btn="primary" icon="i-tabler-calendar-bolt">
                Schedule Publication
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </ElModal>
  </div>
</template>
