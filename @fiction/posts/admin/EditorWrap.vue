<script lang="ts" setup>
import type { NavListItem, PostObject } from '@fiction/core'
import type { FictionContact } from '@fiction/plugins/plugin-contact'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { FictionPosts, TablePostConfig } from '..'
import type { Post } from '../post.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import { dayjs, toLabel, useService, vue, waitFor } from '@fiction/core'
import { createOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElModalConfirm from '@fiction/ui/modal/ElModalConfirm.vue'
import SuccessModal from '@fiction/ui/modal/SuccessModal.vue'
import { managePost, syncFields } from '../utils'
import EditorBody from './EditorBody.vue'
import InputPostReview from './InputPostReview.vue'
import PostPreview from './PostPreview.vue'
import { postEditController } from './tools/tools'

const { card } = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts, fictionContact: FictionContact }>()

const loading = vue.ref(true)
const sending = vue.ref<'schedule' | 'update'>()
const scheduleModalVis = vue.ref(false)
const unscheduleModalConfirm = vue.ref(false)
const previewModalVis = vue.ref(false)
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

const recipientCountRef = vue.ref(0)

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

export type ViewModeKey = 'overview' | 'compose' | 'audience' | 'email' | 'web' | 'review'

export type ViewMode = (PostObject & { value: ViewModeKey, options?: InputOption[], isHidden?: boolean })
const viewModes = vue.computed(() => {
  const org = service.fictionUser.activeOrganization.value

  const recipientCount = recipientCountRef.value
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

    {
      value: 'review',
      title: post?.value?.status.value !== 'draft'
        ? `Your post is ${post?.value?.status.value}`
        : 'Review and Publish',
      icon: { class: 'i-tabler-send' },
      options: [
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'Review Details',
          icon: { class: 'i-tabler-send' },
          options: [
            createOption({
              key: 'review',
              input: InputPostReview,
              props: {
                recipientCount,
                onNavigate: (payload: PanelNavigate) => navigate(payload),
              },
            }),
          ],
        }),

      ],
    },
  ] as const

  return out
})

const activeKey = vue.computed<ViewModeKey>({
  get: () => {
    const r = service.fictionRouter.query.value
    const view = r.view as ViewModeKey || 'overview'
    const visibleModes = viewModes.value.filter(v => !v.isHidden)
    return visibleModes.find(v => v.value === view)?.value || visibleModes[0].value
  },
  set: async (value) => {
    const r = service.fictionRouter.query.value
    await service.fictionRouter.push({ query: { ...r, view: value } }, { caller: 'activeKey' })
  },
})

const activeViewModeIndex = vue.computed(() => viewModes.value.findIndex(v => v.value === activeKey.value))

export type PanelNavigate = {
  dir?: 'next' | 'prev' | 'schedule' | 'preview' | 'unschedule'
  key?: ViewModeKey
}

function navigate(args: PanelNavigate) {
  const { dir, key } = args

  if (key) {
    activeKey.value = key
    return
  }

  if (dir === 'schedule') {
    scheduleModalVis.value = true
    return
  }
  else if (dir === 'unschedule') {
    unscheduleModalConfirm.value = true
    return
  }
  else if (dir === 'preview') {
    previewModalVis.value = true
    return
  }

  const index = activeViewModeIndex.value
  const newIndex = dir === 'next' ? index + 1 : index - 1
  const newMode = viewModes.value[newIndex]

  if (newMode)
    activeKey.value = newMode.value
}

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

const successModalVis = vue.ref(false)
async function saveAndSchedule() {
  sending.value = 'schedule'

  try {
    const p = post.value
    const publishMode = p?.publishMode.value
    const publishAt = publishMode === 'schedule' ? p?.publishAt.value : dayjs().toISOString()
    p?.update({
      status: publishMode === 'now' ? 'published' : 'scheduled',
      emailStatus: 'scheduled',
      publishAt,
    }, { caller: 'saveAndSchedule' })
    await p?.save({ caller: 'saveAndSchedule' })
    scheduleModalVis.value = false

    await waitFor(100)

    await navigate({ key: 'overview' })

    successModalVis.value = true
  }
  catch (e) {
    console.error(e)
  }
  finally {
    sending.value = undefined
  }
}

const publishSuccess = vue.computed(() => {
  return post.value?.publishMode.value === 'schedule'
    ? {
        title: 'Post Scheduled Successfully!',
        content: 'Your post has been scheduled for publication.',
      }
    : {
        title: 'Post Published Successfully!',
        content: 'Your post has been published.',
      }
})

const publishText = vue.computed(() => {
  if (post.value?.publishMode.value === 'schedule') {
    return post.value.publishAt.value
      ? `Publish on ${dayjs(post.value.publishAt.value).format('MMM D, YYYY [at] h:mm A')}`
      : 'Select Date'
  }
  else if (post.value?.publishMode.value === 'now') {
    return 'Publish Now'
  }
})

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
            href="/"
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
          v-if="post?.status"
          :theme="statusMap.theme"
          target="_blank"
          size="sm"
          :icon="statusMap.icon"
          data-test-id="post-status-badge"
          design="ghost"
          class="hidden md:block"
          @click.stop="navigate({ key: 'review' })"
        >
          {{ statusMap.label || toLabel(post?.status.value) }}
        </XButton>
        <XButton
          v-if="post?.emailStatus && post?.emailStatus.value !== post?.status.value"
          theme="default"
          target="_blank"
          size="sm"
          icon="i-tabler-mail"
          data-test-id="post-email-status-badge"
          design="ghost"
          @click.stop="navigate({ key: 'review' })"
        >
          {{ toLabel(post?.emailStatus.value) }}
        </XButton>
      </template>
      <template #headerRight>
        <template v-if="activeKey !== 'overview'">
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
            @click.stop="navigate({ dir: 'preview' })"
          >
            Preview
          </XButton>
        </template>

        <template v-if="activeKey === 'overview'">
          <XButton
            v-if="activeViewModeIndex < viewModes.length - 1"
            theme="primary"
            design="solid"
            size="md"
            data-test-id="next-button-top"
            icon-after="i-tabler-arrow-right"
            @click.prevent="navigate({ dir: 'next' })"
          >
            Edit Post
          </XButton>
        </template>

        <template v-else-if="post?.status && post?.status.value === 'draft'">
          <XButton
            v-if="activeViewModeIndex < viewModes.length - 1"
            theme="primary"
            design="solid"
            size="md"
            data-test-id="next-button-top"
            icon-after="i-tabler-arrow-right"
            @click.prevent="navigate({ dir: 'next' })"
          >
            Review
          </XButton>
          <XButton
            v-else
            theme="primary"
            data-test-id="schedule-button-top"
            icon="i-tabler-calendar"
            icon-after="i-tabler-arrow-right"
            @click.stop="navigate({ dir: 'schedule' })"
          >
            Schedule
          </XButton>
        </template>
        <XButton
          v-else-if="post?.status.value === 'scheduled'"
          theme="orange"
          design="outline"
          size="md"
          data-test-id="next-button-top"
          icon="i-tabler-calendar-off"
          icon-after="i-tabler-arrow-back-up"
          :loading="sending === 'update'"
          @click.prevent.stop="unscheduleModalConfirm = true"
        >
          Unschedule
        </XButton>
        <XButton
          v-else-if="post?.status"
          theme="primary"
          design="solid"
          size="md"
          data-test-id="next-button-top"
          icon-after="i-tabler-upload"
          :loading="sending === 'update'"
          @click.prevent="savePost({ status: 'scheduled' })"
        >
          Update
        </XButton>
      </template>
      <template #default>
        <EditorBody
          v-model:active-key="activeKey"
          :post
          :card
          :view-modes="viewModes"
          @navigate="navigate($event)"
        />
      </template>
    </ViewEditor>

    <ElModal v-model:vis="scheduleModalVis" modal-class="max-w-screen-sm">
      <div class="p-4 font-semibold">
        Schedule Publish
      </div>
      <ElForm v-if="post" data-test-id="publish-panel" class="p-4 space-y-6 relative" @submit="saveAndSchedule()">
        <div class="space-y-6 p-12">
          <ElInput
            v-model="post.publishMode.value"
            input="InputRadioButton"
            label="Schedule Options"
            sub-label="When do you want to publish this post?"
            ui-size="lg"
            :list="[{
              label: 'Publish Now',
              value: 'now',
              icon: { class: 'i-tabler-clock' },
            }, {
              label: 'Schedule for Later',
              value: 'schedule',
              icon: { class: 'i-tabler-calendar' },
            }]"
            required
          />
          <ElInput
            v-if="post.publishMode.value === 'schedule'"
            v-model="post.publishAt.value"
            label="Publish Date and Time"
            sub-label="Select the date and time you want to publish this post."
            ui-size="lg"
            input="InputDate"
            :input-props="{ dateMode: 'future', includeTime: true }"
            required
            data-option-path="publishAt"
          />
        </div>
        <div class="flex justify-between gap-6">
          <XButton
            size="md"
            theme="default"
            type="submit"
            @click.prevent="scheduleModalVis = false"
          >
            Cancel
          </XButton>
          <XButton
            size="md"
            data-test-id="schedule-publish-button"
            theme="primary"
            icon="i-tabler-calendar-bolt"
            type="submit"
            :loading="sending === 'schedule'"
            :disabled="!post.publishMode.value || (post.publishMode.value === 'schedule' && !post.publishAt.value)"
          >
            {{ publishText }}
          </XButton>
        </div>
      </ElForm>
    </ElModal>

    <!-- Success Confirmation Modal -->
    <SuccessModal
      v-model:vis="successModalVis"
      :title="publishSuccess.title"
      :content="publishSuccess.content"
      :action="{ buttons: [{ label: 'Close', theme: 'primary' as const, onClick: () => successModalVis = false }] }"
    />

    <ElModal
      v-model:vis="previewModalVis"
      modal-class="w-full x-font-body h-[calc(100dvh-3rem)] overflow-scroll no-scrollbar"
      transition-mode="slideUp"
      :has-close="true"
    >
      <PostPreview class="p-12" :post :card />
    </ElModal>

    <ElModalConfirm
      v-model:vis="unscheduleModalConfirm"
      title="Unschedule Post?"
      sub="This will revert post to draft status. You'll need to republish."
      @confirmed="savePost({ status: 'draft', emailStatus: 'draft' })"
    />
  </div>
</template>
