<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import { useService, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import InputDate from '@fiction/ui/inputs/InputDate.vue'
import { managePost } from '../utils'
import ElPostEditor from './ElPostEditor.vue'
import { postEditController } from './tools'

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

async function publish(mode: 'publish' | 'schedule' = 'publish') {
  if (!post.value)
    return
  sending.value = 'publish'

  // min 1 second for UX reasons
  await waitFor(500)

  await post.value.save({ mode })

  sending.value = ''
  vis.value = false
  publishItemSelected.value = undefined
}

async function load() {
  loading.value = true
  const r = service.fictionRouter
  const postId = r.query.value.postId as string | undefined

  if (!postId) {
    service.fictionEnv.events.emit('notify', { type: 'error', message: 'No post ID provided.' })
  }
  else {
    const editParams = { _action: 'get', where: { postId }, loadDraft: true } as const
    post.value = await managePost({ fictionPosts: service.fictionPosts, params: editParams })
  }
  loading.value = false
}

vue.onMounted(async () => {
  await load()
})

async function resetToPublished() {
  if (!post.value)
    throw new Error('No post to revert')

  const s = post.value
  const postId = s.postId

  const r = await s.settings.fictionPosts.requests.ManagePost.projectRequest({
    _action: 'revertDraft',
    where: { postId },
  }, { caller: 'postEdit' })

  if (r.status === 'success') {
    const responsePost = r.data?.[0]

    await post.value.update({ ...responsePost }, { noSave: true, caller: 'resetToPublished' })
  }
}
</script>

<template>
  <div>
    <ViewEditor :tool-props="{ post, card }" :controller="postEditController" :loading="loading">
      <template #headerLeft>
        <XButton theme="primary" :href="card.link('/')" class="shrink-0" icon="i-tabler-home" design="outline">
          Home
        </XButton>
        <div class="flex space-x-1 font-medium">
          <RouterLink
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/posts')"
          >
            <span class="i-tabler-pin text-xl inline-block dark:text-theme-500" />
            <span>Edit Post</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XText v-if="post" v-model="post.title.value" class="whitespace-nowrap" :is-editable="true" />
        </div>
      </template>
      <template #headerRight>
        <ElSavingSignal
          v-if="post"
          :is-dirty="post.isDirty.value"
          :nav-items="[{
            name: 'Reset to Published Version',
            onClick: () => resetToPublished(),
            testId: 'reset-to-published',
          }]"
          data-test-id="draft-control-dropdown"
        />
        <XButton
          theme="primary"
          :loading="sending === 'publish'"
          class="min-w-36"
          icon="i-tabler-arrow-big-up-lines"
          size="md"
          data-test-id="publish-button"
          @click.stop.prevent="publish()"
        >
          Publish Changes
        </XButton>
      </template>
      <template #default>
        <div v-if="post">
          <ElPostEditor :post :card />
        </div>
      </template>
    </ViewEditor>
    <ElModal v-model:vis="vis" modal-class="max-w-screen-md p-24 ">
      <div v-if="post" class="relative max-w-xl mx-auto">
        <div class="text-center mb-8 ">
          <div class="text-2xl font-bold antialiased dark:text-theme-0 mb-4 text-balance">
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
          <div class="text-base font-medium text-theme-500 dark:text-theme-300 text-balance">
            <template v-if="publishItemSelected === 'publish'">
              This action will publish now the post and syndicate it to your audience (based on your settings).
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              This will schedule the post to be published at the selected time.
            </template>
            <template v-else>
              Publish to go live and syndicate to your audience (based on your settings).
            </template>
          </div>
        </div>
        <div v-if="!publishItemSelected" class="space-y-6">
          <div class="flex justify-center gap-6">
            <XButton size="md" icon="i-tabler-calendar-bolt" @click="publishItemSelected = 'schedule'">
              Schedule Publication
            </XButton>
            <XButton size="md" theme="primary" icon="i-tabler-arrow-big-up-lines" :loading="sending === 'publish'" @click="publish()">
              Publish Now
            </XButton>
          </div>
        </div>

        <div v-else-if="publishItemSelected === 'schedule'" class="mx-auto max-w-sm">
          <ElForm class=" space-y-6" @submit="publish('schedule')">
            <InputDate v-model="post.publishAt.value" :include-time="true" required date-mode="future" />
            <div class="flex justify-center gap-6">
              <XButton v-if="publishItemSelected" size="md" @click="publishItemSelected = ''">
                &larr; Back
              </XButton>
              <XButton size="md" theme="primary" icon="i-tabler-calendar-bolt" type="submit" :loading="sending === 'publish'">
                Schedule Publication
              </XButton>
            </div>
          </ElForm>
        </div>
      </div>
    </ElModal>
  </div>
</template>
