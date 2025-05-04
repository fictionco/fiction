<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { FictionContact } from '@fiction/plugins/plugin-contact'
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import type { Card, Site } from '@fiction/site'
import type { Post } from '../../post'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import { syncFields } from '@fiction/posts'
import { getPostEmailRecipientCount } from '@fiction/posts/utils/email'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { TablePostSchema as schema, t } from '../../schema'

const { site, post, tool, card } = defineProps<{
  site: Site
  post: Post
  tool: EditorTool<ToolKeys>
  controller: AdminEditorController<{ toolIds: ToolKeys }>
  saveText: string
  card: Card
}>()

const service = useService<{ fictionPosts: FictionPosts, fictionContact: FictionContact }>()
const recipientCountRef = vue.ref()

vue.onMounted(async () => {
  vue.watch(
    () => [post?.audience.value],
    async () => {
      recipientCountRef.value = await getPostEmailRecipientCount({ post, fictionContact: service.fictionContact })
    },
    { deep: true, immediate: true },
  )

  vue.watch(
    () => [post?.title.value, post?.subTitle.value],
    () => {
      if (post) {
        syncFields({ post })
      }
    },
    { immediate: true },
  )
})

const o = vue.computed(() => {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  const recipientCount = recipientCountRef.value
  const isDraft = post?.status.value === 'draft'
  const out = {
    meta: createOption({
      schema,
      key: 'group.meta',
      label: 'Meta',
      input: 'group',
      icon: { class: 'i-tabler-info-circle' },
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
              { name: 'orgId', value: activeOrganizationId },
            ],
          },
        }),

        createOption({
          schema,
          key: 'authors',
          label: 'Author',
          input: 'InputAuthors',
        }),
        createOption({
          schema,
          key: 'dateAt',
          label: 'Display Date',
          description: 'For display and SEO purposes only.',
          input: 'InputDate',
          props: { },
          isVisible: () => !isDraft,
        }),
        createOption({
          schema,
          key: 'tags',
          label: 'Tags',
          input: 'InputTags',
          props: { taxonomyType: 'tag', table: t.posts, column: 'tags' },
        }),
        // createOption({
        //   schema,
        //   key: 'categories',
        //   label: 'Category',
        //   input: 'InputTags',
        //   props: { taxonomyType: 'category', table: t.posts, column: 'categories' },
        // }),
      ],
    }),
    ai: createOption({
      schema,
      key: 'group.ai',
      label: 'Compose',
      input: 'group',
      icon: { class: 'i-tabler-pencil' },
      options: [
        createOption({
          schema,
          key: 'userConfig.contentCompletion.enabled',
          label: 'AI Text Completion',
          input: 'InputToggle',
          props: { textOn: 'Active', textOff: 'Disabled' },
        }),
        createOption({
          schema,
          key: 'userConfig.contentCompletion.prompt',
          label: 'Completion Prompt',
          input: 'InputTextarea',
          placeholder: 'Enter prompt for AI text completion',
        }),
      ],
    }),
    web: createOption({
      schema,
      key: 'group.web',
      input: 'group',
      label: 'Web',
      icon: { class: 'i-tabler-mail' },
      options: [

        createOption({
          schema,
          key: 'visibility',
          label: 'Website Visibility',
          input: 'InputRadioButton',
          list: [
            { label: 'Public', value: 'public', icon: { class: 'i-tabler-globe' } },
            { label: 'Subscribers', value: 'subscribers', icon: { class: 'i-tabler-users' } },
            { label: 'Private', value: 'private', icon: { class: 'i-tabler-lock' } },
            { label: 'Unlisted', value: 'unlisted', icon: { class: 'i-tabler-eye-off' } },
          ],
        }),
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
    email: createOption({
      schema,
      key: 'group.email',
      input: 'group',
      label: 'Email',
      icon: { class: 'i-tabler-mail' },
      disabled: !isDraft,
      options: [
        createOption({
          schema,
          key: 'audience',
          label: 'Select Email Audience',
          input: 'InputRadioButton',
          list: [
            { label: 'All Contacts', value: 'all', icon: { class: 'i-tabler-users' } },
            { label: 'Nobody', value: 'nobody', icon: { class: 'i-tabler-mail-off' } },
          ],
          disabled: !isDraft,
        }),
        createOption({
          schema,
          key: 'subject',
          label: 'Subject Line',
          subLabel: 'This will be same as post title unless modified',
          description: 'The main inbox subject line.',
          input: 'InputText',
          placeholder: post?.title.value || 'Enter Subject',
          isRequired: true,
          disabled: !isDraft,
        }),
        createOption({
          schema,
          key: 'preview',
          label: 'Preview Line',
          subLabel: 'This will be same as post subtitle unless modified',
          description: 'The preview line is the first line of the email and is shown in the inbox',
          input: 'InputText',
          placeholder: post?.subTitle.value || 'Enter Preview Text',
          disabled: !isDraft,
        }),
      ],
    }),

    history: createOption({
      key: 'group.revision',
      label: 'Revision History',
      input: 'group',
      icon: { class: 'i-tabler-history' },
      options: [
        createOption({
          key: 'revisionHistory',
          input: vue.defineAsyncComponent(() => import('../InputRevisionHistory.vue')),
          props: { site, post, tool },
        }),
      ],
    }),
  }

  return tool.toolId === 'history'
    ? [out.history]
    : [out.meta, out.ai, out.web, out.email]
})

function updatePost(config: TablePostConfig) {
  if (!post)
    return

  post?.update(config, { caller: 'postFormEngine' })
}
</script>

<template>
  <ElTool v-bind="{ tool, site }">
    <FormEngine
      :model-value="post.toConfig()"
      state-key="revision"
      :options="o"
      :input-props="{ site, tool, post, card }"
      @update:model-value="updatePost($event as TablePostConfig)"
    />
  </ElTool>
</template>
