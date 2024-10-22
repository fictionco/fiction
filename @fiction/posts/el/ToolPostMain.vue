<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { ActionButton } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import type { TablePostConfig } from '../schema'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
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
    new InputOption({
      key: 'postHandling',
      label: 'Post Handling',
      input: 'group',
      options: [
        new InputOption({
          key: 'status',
          label: 'Status',
          input: 'InputSelectCustom',
          isRequired: true,
          list: ['draft', 'published', 'scheduled', 'archived'],
        }),
        new InputOption({
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
        new InputOption({
          key: 'slug',
          label: 'Slug',
          input: 'InputUsername',
          placeholder: 'my-post',
          isRequired: true,
          props: {
            table: t.posts,
            columns: [{ name: 'slug', allowReserved: true }, { name: 'orgId', value: activeOrganizationId }],
          },
        }),
        new InputOption({
          key: 'userConfig.isContentCompletionDisabled',
          label: 'Disable Content Completions (AI)',
          description: `Disables content completions while you're writing.`,
          input: 'InputToggle',
        }),
      ],
    }),

    new InputOption({
      key: 'postContentGroup',
      label: 'Post Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'media',
          label: 'Featured Image',
          description: 'The image that will be displayed with the post',
          input: 'InputMedia',
        }),
        new InputOption({
          key: 'title',
          label: 'Post Title',
          input: 'InputText',
          placeholder: 'Post Title',
          isRequired: true,
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Sub Title / Tagline',
          input: 'InputText',
        }),
        new InputOption({
          key: 'excerpt',
          label: 'Excerpt',
          description: 'A short teaser for the post',
          input: 'InputTextarea',
        }),
        new InputOption({
          key: 'content',
          input: 'hidden',
        }),
        new InputOption({
          key: 'dateAt',
          label: 'Display Date',
          description: 'For display and SEO purposes only.',
          input: 'InputDate',
          props: { },
        }),
      ],
    }),
    new InputOption({
      key: 'seoGroup',
      label: 'Search and SEO',
      input: 'group',
      options: [
        new InputOption({ key: 'userConfig.seo.title', label: 'SEO Title', input: 'InputText' }),
        new InputOption({ key: 'userConfig.seo.description', label: 'SEO Description', input: 'InputText' }),
      ],
    }),
    new InputOption({
      key: 'taxonomyGroup',
      label: 'Taxonomy',
      input: 'group',
      options: [
        new InputOption({ key: 'tags', label: 'Tags', input: 'InputItems', props: { taxonomyType: 'tag', table: t.posts, column: 'tags' } }),
        new InputOption({ key: 'categories', label: 'Categories', input: 'InputItems', props: { taxonomyType: 'category', table: t.posts, column: 'categories' } }),
        new InputOption({ key: 'authors', label: 'Authors', input: InputAuthors, props: { } }),
      ],
    }),
    new InputOption({
      key: 'dangerZone',
      label: 'Danger Zone',
      input: 'group',
      options: [
        new InputOption({
          key: 'deletePost',
          label: 'Permanently Delete Post',
          input: InputActionList,
          props: {
            actions: [
              {
                name: 'Delete Post...',
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
  <ElTool v-if="post" :tool>
    <FormEngine
      state-key="postEdit"
      :model-value="post.toConfig()"
      :options
      :input-props="{ post, card }"
      @update:model-value="updatePost($event as TablePostConfig)"
    />
  </ElTool>
</template>
