<script lang="ts" setup>
import type { NavListItem, PostObject } from '@fiction/core'
import type { FictionContact } from '@fiction/plugins/plugin-contact'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { FictionPosts, TablePostConfig } from '..'
import type { Post } from '../post.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import { managePost, syncFields } from '../utils'
import EditorBody from './EditorBody.vue'
import ReviewModal from './ReviewModal.vue'
import { postEditController } from './tools/tools'

const { card } = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts, fictionContact: FictionContact }>()

export type EditorLocation = 'compose' | 'overview' | ''
export type ModalLocation = 'review' | 'success' | 'preview' | 'unschedule' | ''

const loading = vue.ref(true)
const sending = vue.ref<'schedule' | 'update'>()
const post = vue.shallowRef<Post | undefined>()

async function load() {
  loading.value = true
  const r = service.fictionRouter
  const postId = r.query.value.postId as string | undefined

  if (!postId) {
    service.fictionEnv.events.emit('notify', { type: 'error', message: 'No post ID provided.' })
  }
  else {
    const editParams = { _action: 'get', where: { postId } } as const
    post.value = await managePost({ card, fictionPosts: service.fictionPosts, params: editParams, caller: 'postEdit' })
  }
  loading.value = false
}

vue.onMounted(async () => {
  await load()

  vue.watch(
    () => [post.value?.title.value, post.value?.subTitle.value],
    () => {
      if (post.value) {
        syncFields({ post: post.value })
      }
    },
    { immediate: true },
  )
})

export type ViewMode = (PostObject & { value: EditorLocation, options?: InputOption[], isHidden?: boolean })
const viewModes = vue.computed(() => {
  const org = service.fictionUser.activeOrganization.value

  const isDraft = post.value?.status.value === 'draft'
  const out: ViewMode[] = [
    {
      value: 'overview',
      title: 'Overview',
      icon: { class: 'i-tabler-file-power' },
      isHidden: isDraft,
    },
    {
      value: 'compose',
      title: 'Edit Post',
      icon: { class: 'i-tabler-edit' },
    },

  ] as const

  return out
})

const modal = vue.ref<ModalLocation>('')

async function savePost(postConfig?: Partial<TablePostConfig>) {
  sending.value = 'update'

  try {
    if (postConfig) {
      post.value?.update(postConfig, { caller: 'savePost' })
    }

    await post.value?.save({ caller: 'updatePost' })
  }
  catch (e) {
    console.error(e)
  }
  finally {
    sending.value = undefined
  }
}

const statusMap = vue.computed<NavListItem>(() => {
  const status = post.value?.status.value || 'draft'

  const publishAt = post.value?.publishAt.value
  const scheduledLabel = publishAt ? `Scheduled (${dayjs(publishAt).format('MMM D, YYYY [at] h:mm A')})` : 'Scheduled'

  const statusMap = {
    draft: { icon: { class: 'i-tabler-edit' }, theme: 'default' },
    scheduled: { icon: { class: 'i-tabler-calendar' }, theme: 'orange', label: scheduledLabel },
    published: { icon: { class: 'i-tabler-check' }, theme: 'green' },
    archived: { icon: { class: 'i-tabler-archive' }, theme: 'rose' },
  } as const

  return statusMap[status as keyof typeof statusMap] || statusMap.draft
})
</script>

<template>
  <div>
    <ViewEditor :tool-props="{ post, card }" :controller="postEditController" :loading="loading" :card>
      <template #headerLeft>
        <div>
          <XButton
            :card
            size="md"
            href="/posts"
            icon="i-tabler-arrow-left"
            design="link"
          />
        </div>
        <div class="flex space-x-1 font-semibold items-center">
          <span class="text-theme-500">Post Editor</span>
          <span class="i-tabler-slash text-xl dark:text-theme-500" />
          <XText v-if="post" v-model="post.title.value" title="Post Title" :is-editable="true" class="hover:bg-theme-100 hover:dark:bg-theme-700 whitespace-nowrap truncate max-w-[300px]" />
        </div>

        <XButton
          v-if="post?.status.value"
          :theme="statusMap.theme"
          target="_blank"
          size="sm"
          :icon="statusMap.icon"
          data-test-id="post-status-badge"
          design="link"

          class="hidden md:block"
        >
          {{ statusMap.label || toLabel(post?.status.value) }}
        </XButton>
      </template>
      <template #headerRight>
        <ElSavingSignal
          v-if="post"
          :is-dirty="post.saveUtil.isDirty.value"
          data-test-id="draft-control-dropdown"
          ui-size="sm"
          class="mr-2"
        />
        <XButton
          theme="default"
          target="_blank"
          size="md"
          icon="i-tabler-eye"
          data-test-id="preview-post-button"
          design="ghost"
          @click.stop="modal = 'preview'"
        >
          Preview
        </XButton>

        <template v-if="post?.status && post?.status.value === 'draft'">
          <XButton
            theme="primary"
            design="solid"
            size="md"
            data-test-id="next-button-top"
            icon-after="i-tabler-arrow-right"
            @click.stop="modal = 'review'"
          >
            Review & Publish
          </XButton>
        </template>
        <template v-else-if="post?.status">
          <XButton
            v-if="post?.status.value === 'scheduled'"
            theme="orange"
            design="outline"
            size="md"
            data-test-id="next-button-top"
            :loading="sending === 'update'"
            @click.prevent.stop="modal = 'unschedule'"
          >
            Unschedule
          </XButton>
          <template v-else>
            <XButton
              theme="primary"
              design="solid"
              size="md"
              data-test-id="next-button-top"
              icon-after="i-tabler-arrow-up-right"
              @click.prevent="savePost()"
            >
              Save
            </XButton>
          </template>
        </template>
      </template>
      <template #default>
        <EditorBody
          :post
          :card
          :view-modes="viewModes"
        />
      </template>
    </ViewEditor>

    <ReviewModal
      :card
      :post
      :modal
      @update:post="savePost($event)"
      @update:modal="modal = $event"
    />
  </div>
</template>
