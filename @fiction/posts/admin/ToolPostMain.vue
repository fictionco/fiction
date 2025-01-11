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
import InputAuthors from './InputAuthors.vue'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

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
          key: 'postContentGroup',
          label: 'Post Content',
          input: 'group',
          icon: { class: 'i-tabler-highlight' },
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
              key: 'title',
              label: 'Post Title',
              input: 'InputText',
              placeholder: 'Enter a title...',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'subTitle',
              label: 'Sub Title / Tagline',
              placeholder: 'Enter a sub title...',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'userConfig.isContentCompletionDisabled',
              label: 'Disable AI Completions',
              subLabel: `Turn off completions while you're writing.`,
              input: 'InputToggle',
              props: { textOn: 'Disabled', textOff: 'Active' },
            }),

            createOption({
              schema,
              key: 'content',
              input: 'hidden',
            }),
          ],
        }),
        createOption({
          schema,
          key: 'postContentGroup',
          label: 'Meta Details',
          input: 'group',
          icon: { class: 'i-tabler-highlight' },
          options: [

            createOption({
              schema,
              key: 'excerpt',
              label: 'Excerpt',
              description: 'A short teaser for the post',
              input: 'InputTextarea',
              placeholder: 'Enter a short excerpt...',
              props: { rows: 2 },
            }),
            createOption({
              schema,
              key: 'dateAt',
              label: 'Display Date',
              description: 'For display and SEO purposes only.',
              input: 'InputDate',
              props: { },
            }),
          ],
        }),
        createOption({
          schema,
          key: 'postHandling',
          label: 'Publishing',
          input: 'group',
          icon: { class: 'i-tabler-calendar' },
          options: [
            createOption({
              schema,
              key: 'status',
              label: 'Status',
              input: 'InputSelectCustom',
              isRequired: true,
              list: ['draft', 'published', 'scheduled', 'archived'],
            }),
            createOption({
              schema,
              key: 'publishAt',
              label: 'Scheduled Publish Date',
              input: 'InputDate',
              isRequired: true,
              isHidden: props.post?.status.value !== 'scheduled',
              props: {
                includeTime: true,
                dateMode: 'future',
              },
            }),
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

          ],
        }),
        createOption({
          schema,
          key: 'seoGroup',
          label: 'Search and SEO',
          input: 'group',
          icon: { class: 'i-tabler-search' },
          options: [
            createOption({
              schema,
              key: 'userConfig.seo.title',
              label: 'SEO Title',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'userConfig.seo.description',
              label: 'SEO Description',
              input: 'InputText',
            }),
          ],
        }),
        createOption({
          schema,
          key: 'taxonomyGroup',
          label: 'Taxonomy',
          input: 'group',
          icon: { class: 'i-tabler-tag' },
          options: [
            createOption({
              schema,
              key: 'tags',
              label: 'Tags',
              input: 'InputTags',
              props: { taxonomyType: 'tag', table: t.posts, column: 'tags' },
            }),
            createOption({
              schema,
              key: 'categories',
              label: 'Categories',
              input: 'InputTags',
              props: { taxonomyType: 'category', table: t.posts, column: 'categories' },
            }),
            createOption({
              schema,
              key: 'authors',
              label: 'Authors',
              input: InputAuthors,
              props: { },
            }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'dangerZone',
      label: 'Danger Zone',
      input: 'group',
      icon: { class: 'i-tabler-alert-triangle' },
      options: [
        createOption({
          key: 'deletePost',
          label: 'Permanently Delete Post',
          input: InputActionList,
          props: {
            actions: [
              {
                label: 'Delete Post...',
                theme: 'rose',
                design: 'ghost',
                icon: 'i-tabler-trash',
                onClick: (args) => {
                  const p = args.props as { post: Post }
                  const confirmed = confirm('Are you sure you want to delete this post?')

                  if (confirmed) {
                    p.post?.delete()
                    props.card.goto('/posts')
                  }
                },
              },
            ] as ActionButton[],
          },
        }),

      ],
    }),
  ]
})

function updatePost(config: TablePostConfig) {
  if (!props.post)
    return

  // const el = document.querySelector('#toolForm') as HTMLFormElement | null
  // const valid = el?.checkValidity()

  props.post?.update(config, { caller: 'postFormEngine' })
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
