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
import PostEditor from './PostEditor.vue'
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

async function publish(mode: 'publish' = 'publish') {
  if (!post.value)
    return
  sending.value = 'publish'

  // min 1 second for UX reasons
  await waitFor(500)

  await post.value.save({ mode, caller: 'publishButton' })

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
    post.value = await managePost({ fictionPosts: service.fictionPosts, params: editParams, caller: 'postEdit' })
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
    <ViewEditor :tool-props="{ post, card }" :controller="postEditController" :loading="loading" :card>
      <template #headerLeft>
        <XButton theme="default" :href="card.link('/posts')" class="shrink-0" icon="i-tabler-arrow-left" design="ghost">
          All
        </XButton>
        <div class="flex space-x-1 font-medium">
          <RouterLink
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/posts')"
          >
            <span class="i-tabler-file-text text-xl inline-block dark:text-theme-500" />
            <span>Post</span>
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
            label: 'Reset to Published',
            onClick: () => resetToPublished(),
            testId: 'reset-to-published',
          }]"
          data-test-id="draft-control-dropdown"
        />
        <XButton
          v-if="post?.hasChanges.value || post?.isDirty.value"
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
        <XButton
          v-else
          theme="primary"
          design="outline"
          :loading="sending === 'publish'"
          class="min-w-36"
          icon="i-tabler-check"
          size="md"
          data-test-id="changes-published-button"
          @click.stop.prevent="publish()"
        >
          Changes Published
        </XButton>
      </template>
      <template #default>
        <PostEditor :post :card />
      </template>
    </ViewEditor>
  </div>
</template>
