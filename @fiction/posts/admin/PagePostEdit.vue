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
import { t } from '..'
import { TablePostSchema as schema } from '../schema.js'
import { managePost, syncFields } from '../utils'
import { getPostEmailRecipientCount } from '../utils/email'
import InputAudienceFilter from './InputAudienceFilter.vue'
import InputPostReview from './InputPostReview.vue'
import PostEditor from './PostEditor.vue'
import PostPreview from './PostPreview.vue'
import { postEditController } from './tools'

defineProps({
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
    post.value = await managePost({ fictionPosts: service.fictionPosts, params: editParams, caller: 'postEdit' })
  }
  loading.value = false
}

const recipientCountRef = vue.ref(0)

vue.onMounted(async () => {
  await load()

  vue.watch(
    () => [post.value?.emailConfig.value.target, post.value?.emailConfig.value.filters],
    async () => {
      recipientCountRef.value = await getPostEmailRecipientCount({ post: post.value, fictionContact: service.fictionContact })
    },
    { deep: true, immediate: true },
  )

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
      value: 'audience',
      title: 'Select Audience',
      icon: { class: 'i-tabler-users' },
      options: [
        createOption({
          schema,
          key: 'group.audienceEmail',
          input: 'group',
          label: 'Newsletter Audience',
          icon: { class: 'i-tabler-mail' },
          options: [
            createOption({
              schema,
              key: 'emailConfig.target',
              label: 'Select Audiences',
              input: 'InputRadioButton',
              list: [
                { label: 'All Contacts', value: 'all', icon: { class: 'i-tabler-users' } },
                { label: 'Filter by Tag', value: 'filtered', icon: { class: 'i-tabler-filter' } },
                { label: 'No Email', value: 'nobody', icon: { class: 'i-tabler-mail-off' } },
              ],
              props: { uiSize: 'md' },
              disabled: post.value?.status.value !== 'draft',
            }),
            createOption({
              schema,
              label: 'Estimated Recipients',
              subLabel: 'Based on selected options and filters',
              key: 'emailConfig.filters',
              input: InputAudienceFilter,
              props: { recipientCount },
              disabled: post.value?.status.value !== 'draft',
            }),
          ],
        }),
        createOption({
          schema,
          key: 'group.audienceWeb',
          input: 'group',
          label: 'Web Audience',
          icon: { class: 'i-tabler-world' },
          options: [
            createOption({
              schema,
              key: 'visibility',
              label: 'Website Visibility',
              input: 'InputRadioButton',
              list: [
                { label: 'Public', value: 'public', icon: { class: 'i-tabler-globe' } },
                { label: 'Private', value: 'private', icon: { class: 'i-tabler-lock' } },
                { label: 'Unlisted', value: 'unlisted', icon: { class: 'i-tabler-eye-off' } },
              ],
              props: { uiSize: 'md' },
            }),
          ],
        }),
      ],
    },
    {
      value: 'email',
      title: 'Email Setup',
      icon: { class: 'i-tabler-mail' },
      options: [
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'Inbox Settings',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({
              schema,
              key: 'emailConfig.subject',
              label: 'Subject Line',
              subLabel: 'This will be same as post title unless modified',
              description: 'The main inbox subject line.',
              input: 'InputText',
              placeholder: post.value?.title.value || 'Enter Subject',
              isRequired: true,
              disabled: post.value?.status.value !== 'draft',
            }),
            createOption({
              schema,
              key: 'emailConfig.preview',
              label: 'Preview Line',
              subLabel: 'This will be same as post subtitle unless modified',
              description: 'The preview line is the first line of the email and is shown in the inbox',
              input: 'InputText',
              placeholder: post.value?.subTitle.value || 'Enter Preview Text',
              disabled: post.value?.status.value !== 'draft',
            }),
          ],
        }),
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'Sender Settings (Global)',
          icon: { class: 'i-tabler-mail-forward' },
          options: [
            createOption({
              schema,
              key: 'sender.senderName',
              label: 'Send From Name',
              subLabel: 'The name that will appear in the inbox',
              input: 'InputText',
              placeholder: org?.orgName || 'Enter Name',
            }),
            createOption({
              schema,
              key: 'sender.senderEmail',
              label: 'Reply To Email',
              subLabel: 'The "sent from" email address',
              input: 'InputEmail',
              placeholder: org?.orgEmail || 'Enter Email',
            }),
          ],
        }),
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'Additional Settings (Global)',
          icon: { class: 'i-tabler-mail-forward' },
          options: [
            createOption({
              schema,
              key: 'sender.websiteUrl',
              label: 'Website URL',
              subLabel: 'Adds a link to your website in the email footer',
              input: 'InputUrl',
              placeholder: org?.websiteUrl || 'Primary Website URL',
            }),
            createOption({
              schema,
              key: 'sender.companyName',
              label: 'Company Name',
              subLabel: 'The legal name of your company',
              input: 'InputText',
              placeholder: org?.companyName || 'Enter Name',
              props: {
                autocomplete: 'organization',
              },
            }),
            createOption({
              schema,
              key: 'sender.streetAddress',
              label: 'Street Address',
              subLabel: 'The physical address of your company',
              input: 'InputText',
              placeholder: org?.streetAddress || 'Enter Address',
              props: {
                autocomplete: 'street-address',
              },
            }),

          ],
        }),
      ],
    },
    {
      value: 'web',
      title: 'Web and SEO',
      icon: { class: 'i-tabler-world' },
      options: [
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'Web Settings',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({
              schema,
              key: 'slug',
              label: 'Slug',
              input: 'InputHandle',
              placeholder: 'my-post',
              isRequired: true,
              props: {
                table: t.posts,
                columns: [
                  { name: 'slug', allowReserved: true },
                  { name: 'orgId', value: org?.orgId },
                ],
              },
            }),
            createOption({
              schema,
              key: 'media',
              label: 'Featured Image',
              description: 'The image that will be displayed with the post',
              input: 'InputMedia',
            }),
          ],
        }),
        createOption({
          key: 'group.inbox',
          input: 'group',
          label: 'SEO',
          icon: { class: 'i-tabler-search' },
          options: [
            createOption({
              schema,
              key: 'userConfig.standard.title',
              label: 'SEO Title',
              description: 'The title that will be displayed in search results.',
              placeholder: 'Enter Title',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'userConfig.standard.description',
              label: 'SEO Description',
              description: 'The description that will be displayed in search results.',
              placeholder: 'Enter Description',
              input: 'InputText',

            }),
          ],
        }),
      ],
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
        <XButton
          theme="default"
          :href="card.link('/posts')"
          class="shrink-0"
          icon="i-tabler-arrow-left"
          design="ghost"
          respond="icon:md"
        >
          All
        </XButton>
        <div class="flex space-x-1 font-medium pr-4">
          <RouterLink
            class="hidden md:flex whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0  items-center gap-1"
            :to="card.link('/posts')"
          >
            <span class="i-tabler-file-text text-xl inline-block dark:text-theme-500" />
            <span>Post</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XText v-if="post" v-model="post.title.value" class="whitespace-nowrap" :is-editable="true" />
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
            class="hidden md:block"
          />
          <XButton
            theme="default"
            target="_blank"
            size="sm"
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
            Next
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
        <PostEditor
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
