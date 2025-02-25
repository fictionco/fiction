<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugins/plugin-subscribe'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { FictionPosts } from '..'
import type { Post } from '../post.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import { dayjs, useService, vue, waitFor } from '@fiction/core'
import { createOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import SuccessModal from '@fiction/ui/modal/SuccessModal.vue'
import { t } from '..'
import { TablePostSchema as schema } from '../schema.js'
import { managePost } from '../utils'
import { getPostEmailRecipientCount } from '../utils/email'
import InputAudienceFilter from './InputAudienceFilter.vue'
import InputPostReview from './InputPostReview.vue'
import PostEditor from './PostEditor.vue'
import PostPreview from './PostPreview.vue'
import { postEditController } from './tools'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts, fictionSubscribe: FictionSubscribe }>()

const loading = vue.ref(true)
const sending = vue.ref<'schedule'>()
const scheduleModalVis = vue.ref(false)
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
      recipientCountRef.value = await getPostEmailRecipientCount({ post: post.value, fictionSubscribe: service.fictionSubscribe })
    },
    { deep: true, immediate: true },
  )
})

export type ViewModeKey = 'compose' | 'audience' | 'email' | 'web' | 'review'

export type ViewMode = (PostObject & { value: ViewModeKey, options?: InputOption[] })
const viewModes = vue.computed(() => {
  const emailConfig = post.value?.emailConfig.value
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  const recipientCount = recipientCountRef.value
  const out: ViewMode[] = [
    { value: 'compose', title: 'Edit Post', icon: { class: 'i-tabler-edit' } },
    {
      value: 'audience',
      title: 'Select Audience',
      icon: { class: 'i-tabler-users' },
      options: [
        createOption({
          schema,
          key: 'group.audienceEmail',
          input: 'group',
          label: 'Email Audience',
          icon: { class: 'i-tabler-mail' },
          options: [
            createOption({
              schema,
              key: 'emailConfig.target',
              label: 'Select Audiences',
              input: 'InputRadioButton',
              list: [
                { label: 'All Contacts', value: 'all', icon: 'i-tabler-users' },
                { label: 'Filter by Tag', value: 'filtered', icon: 'i-tabler-filter' },
                { label: 'No Email', value: 'nobody', icon: 'i-tabler-mail-off' },
              ],
              props: { uiSize: 'md' },
            }),
            createOption({
              schema,
              key: 'emailConfig.filters',
              input: InputAudienceFilter,
              props: { recipientCount },
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
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Unlisted', value: 'unlisted' },
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
              placeholder: 'Enter Subject',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'emailConfig.preview',
              label: 'Preview Line',
              subLabel: 'This will be same as post subtitle unless modified',
              description: 'The preview line is the first line of the email and is shown in the inbox',
              input: 'InputText',
              placeholder: 'Enter Preview Text',
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
              key: 'emailConfig.sender.senderName',
              label: 'Send From Name',
              subLabel: 'The name that will appear in the inbox',
              input: 'InputText',
              placeholder: 'Enter Name',
            }),
            createOption({
              schema,
              key: 'emailConfig.sender.senderEmail',
              label: 'Send From Email',
              subLabel: 'The "sent from" email address',
              input: 'InputEmail',
              placeholder: 'Enter "sent from" Email',
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
              key: 'emailConfig.sender.websiteUrl',
              label: 'Website URL',
              subLabel: 'Adds a link to your website in the email footer',
              input: 'InputUrl',
              placeholder: 'Primary Website URL',
            }),
            createOption({
              schema,
              key: 'emailConfig.sender.companyName',
              label: 'Company Name',
              subLabel: 'The legal name of your company',
              input: 'InputText',
              placeholder: 'Enter Name',
              props: {
                autocomplete: 'organization',
              },
            }),
            createOption({
              schema,
              key: 'emailConfig.sender.streetAddress',
              label: 'Street Address',
              subLabel: 'The physical address of your company',
              input: 'InputText',
              placeholder: 'Enter Address',
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
              input: 'InputUsername',
              placeholder: 'my-post',
              isRequired: true,
              props: {
                table: t.posts,
                columns: [
                  { name: 'slug', allowReserved: true },
                  { name: 'orgId', value: activeOrganizationId },
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
              key: 'userConfig.site.title',
              label: 'SEO Title',
              description: 'The title that will be displayed in search results.',
              placeholder: 'Enter Title',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'userConfig.site.description',
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
      title: 'Review and Publish',
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

const activeKey = vue.ref<ViewModeKey>('compose')
const activeViewModeIndex = vue.computed(() => viewModes.value.findIndex(v => v.value === activeKey.value))

export type PanelNavigate = {
  dir?: 'next' | 'prev' | 'schedule' | 'preview'
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

const successModalVis = vue.ref(false)
async function saveAndSchedule() {
  sending.value = 'schedule'

  try {
    const p = post.value
    p?.update({ status: 'approved' }, { caller: 'saveAndSchedule' })
    await p?.save({ caller: 'saveAndSchedule' })
    scheduleModalVis.value = false

    await waitFor(100)

    await navigate({ key: 'compose' })

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
          :is-dirty="post.saveUtil.isDirty.value"
          data-test-id="draft-control-dropdown"
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

        <XButton
          v-if="activeViewModeIndex < viewModes.length - 1"
          theme="primary"
          design="outline"
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
      <ElForm v-if="post" class="p-4 space-y-6 relative" @submit="saveAndSchedule()">
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
              icon: 'i-tabler-clock',
            }, {
              label: 'Schedule for Later',
              value: 'schedule',
              icon: 'i-tabler-calendar',
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
            theme="primary"
            icon="i-tabler-calendar-bolt"
            type="submit"
            :loading="sending === 'schedule'"
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
      <PostPreview :post :card />
    </ElModal>
  </div>
</template>
