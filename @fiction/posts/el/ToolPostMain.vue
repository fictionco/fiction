<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'
import InputActions from '@fiction/ui/inputs/InputActions.vue'
import type { Post } from '../post'
import type { TablePostConfig } from '../schema'
import { t } from '../schema'
import type { FictionPosts } from '..'
import InputTaxonomy from './InputTaxonomy.vue'
import InputAuthors from './InputAuthors.vue'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const actions: ActionItem[] = [
  // {
  //   name: 'New Page',
  //   icon: 'i-tabler-circle-plus',
  //   onClick: () => {},
  // },
]

const options = vue.computed(() => {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  return [

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
      key: 'postContentGroup',
      label: 'Post Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'image',
          label: 'Featured Image',
          description: 'The image that will be displayed with the post',
          input: 'InputImage',
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
        new InputOption({ key: 'tags', label: 'Tags', input: InputTaxonomy, props: { taxonomyType: 'tag' } }),
        new InputOption({ key: 'categories', label: 'Categories', input: InputTaxonomy, props: { taxonomyType: 'category' } }),

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
          input: InputActions,
          props: {
            actions: [
              {
                name: 'Delete Post...',
                btn: 'danger',
                onClick: (args) => {
                  const p = args.props as { post: Post }
                  const confirmed = confirm('Are you sure you want to delete this post?')

                  if (confirmed) {
                    p.post?.delete()
                    props.card.goto('/posts')
                  }
                },
              },
            ] as ActionItem[],
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

  props.post?.update(config)
}
</script>

<template>
  <ElTool v-if="post" :tool="tool" :actions="actions">
    <ElForm id="toolForm">
      <ToolForm
        :model-value="post.toConfig()"
        :options="options"
        :input-props="{ post, card }"
        @update:model-value="updatePost($event as TablePostConfig)"
      />
    </ElForm>
  </ElTool>
</template>
