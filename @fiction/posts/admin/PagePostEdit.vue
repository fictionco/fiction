<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { FictionPosts } from '..'
import type { Post } from '../post.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import { useService, vue, waitFor } from '@fiction/core'
import { createOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import { t } from '..'
import { TablePostSchema as schema } from '../schema.js'
import { managePost } from '../utils'
import InputAudienceFilter from './InputAudienceFilter.vue'
import PostEditor from './PostEditor.vue'
import { postEditController } from './tools'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(true)
const sending = vue.ref()
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

vue.onMounted(async () => {
  await load()
})

export type ViewModeKey = 'compose' | 'audience' | 'email' | 'web' | 'review'

export type ViewMode = (PostObject & { value: ViewModeKey, options?: InputOption[] })
const viewModes = vue.computed(() => {
  const emailConfig = post.value?.emailConfig.value
  const activeOrganizationId = service.fictionUser.activeOrgId.value
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
              description: 'The main inbox subject line.',
              input: 'InputText',
              placeholder: 'Enter Subject',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'emailConfig.preview',
              label: 'Preview Line',
              description: 'The preview line is the first line of the email and is shown in the inbox',
              input: 'InputText',
              placeholder: 'Enter Preview Text',
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
    { value: 'review', title: 'Review and Publish', icon: { class: 'i-tabler-check' } },
  ] as const

  return out
})

const activeKey = vue.ref<ViewModeKey>('compose')
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
        >
          Preview
        </XButton>
        <XButton
          v-if="post?.status.value === 'draft'"
          theme="primary"
          :loading="sending === 'publish'"
          icon-after="i-tabler-arrow-right"
          size="md"
          data-test-id="publish-button"
          @click.stop.prevent="activeKey = 'audience'"
        >
          Next
        </XButton>
      </template>
      <template #default>
        <PostEditor v-model:active-key="activeKey" :post :card :view-modes="viewModes" />
      </template>
    </ViewEditor>
  </div>
</template>
