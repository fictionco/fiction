<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { ActionButton } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import type { TablePostConfig } from '../schema'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { PostSchema as schema, useService, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputActionList from '@fiction/ui/inputs/InputActionList.vue'
import { t } from '../schema'

const { tool, post, card } = defineProps<{
  tool: EditorTool
  post?: Post
  card: Card
}>()

const service = useService<{ fictionPosts: FictionPosts }>()

const options = vue.computed<InputOption[]>(() => {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  return [
    createOption({
      schema,
      key: 'group.content',
      label: 'Post',
      input: 'group',
      icon: { class: 'i-tabler-file-text' },
      options: [
        createOption({
          schema,
          key: 'group.postContent',
          label: 'Composition Settings',
          input: 'group',
          icon: { class: 'i-tabler-highlight' },
          options: [
            createOption({
              schema,
              key: 'userConfig.isContentCompletionDisabled',
              label: 'Disable AI Completions',
              subLabel: `Turn off completions while you're writing.`,
              input: 'InputToggle',
              props: { textOn: 'Disabled', textOff: 'Active' },
            }),

          ],
        }),
        createOption({
          schema,
          key: 'postHandling',
          label: 'Post Settings',
          input: 'group',
          icon: { class: 'i-tabler-calendar' },
          options: [
            createOption({
              schema,
              key: 'media',
              label: 'Featured Image',
              description: 'The image that will be displayed with the post',
              input: 'InputMedia',
            }),
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
              key: 'theme',
              label: 'Theme',
              description: 'Change the colors used in the post',
              input: 'InputColorTheme',
              props: { mode: 'bright' },
            }),
          ],
        }),

        createOption({
          schema,
          key: 'taxonomyGroup',
          label: 'Tags and Categories',
          input: 'group',
          icon: { class: 'i-tabler-tag' },
          options: [
            createOption({
              schema,
              key: 'tags',
              label: 'Tags',
              input: 'InputTags',
              props: { taxonomyType: 'tag', table: t.posts, column: 'tags', theme: 'indigo' },
            }),
            createOption({
              schema,
              key: 'categories',
              label: 'Category',
              input: 'InputTags',
              props: { taxonomyType: 'category', table: t.posts, column: 'categories', theme: 'green' },
            }),
            createOption({
              schema,
              key: 'authors',
              label: 'Author',
              input: 'InputAuthors',
              props: { teamLink: card.link('/team') },
            }),
          ],
        }),
        createOption({
          schema,
          key: 'group.advanced',
          label: 'Advanced Settings',
          input: 'group',
          icon: { class: 'i-tabler-stars' },
          isClosed: true,
          options: [

            createOption({
              schema,
              key: 'dateAt',
              label: 'Display Date',
              description: 'For display and SEO purposes only.',
              input: 'InputDate',
              props: { },
            }),
            createOption({
              key: 'deletePost',
              label: 'Delete Post',
              input: InputActionList,
              props: {
                buttons: () => [
                  {
                    label: 'Delete Post...',
                    theme: 'rose',
                    design: 'outline',
                    size: 'xs',
                    icon: 'i-tabler-trash',
                    onClick: (args) => {
                      const p = args.props as { post: Post }
                      const confirmed = confirm('Are you sure you want to delete this post?')

                      if (confirmed) {
                        p.post?.delete()
                        card.goto('/posts')
                      }
                    },
                  },
                ] as ActionButton[],
              },
            }),
          ],
        }),

      ],
    }),

  ]
})

function updatePost(config: TablePostConfig) {
  if (!post)
    return

  // const el = document.querySelector('#toolForm') as HTMLFormElement | null
  // const valid = el?.checkValidity()
  post?.update(config, { caller: 'postFormEngine' })
}
</script>

<template>
  <div>
    <ElTool v-if="post" :tool>
      <FormEngine
        state-key="postEdit"
        :model-value="post.toConfig()"
        :options
        :input-props="{ post, card }"
        @update:model-value="updatePost($event as TablePostConfig)"
      />
    </ElTool>
  </div>
</template>
