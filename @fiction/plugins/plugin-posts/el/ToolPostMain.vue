<script lang="ts" setup>
import { useService, vue, waitFor } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Post } from '../post'
import type { TablePostConfig } from '../schema'
import { t } from '../schema'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
})

const service = useService()

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
      key: 'taxonomyGroup',
      label: 'Taxonomy',
      input: 'group',
      options: [
        new InputOption({
          key: 'status',
          label: 'Tags',
          input: 'InputSelectCustom',
          props: {
            fetchList: async (search: string) => {
              await waitFor(1000)
              return [
                { value: 'tag1', name: 'Tag 1' },
                { value: 'tag2', name: 'Tag 2' },
                { value: 'tag3', name: 'Tag 3' },
                { value: 'tag4', name: 'Tag 4' },
                { value: 'tag5', name: 'Tag 5' },
                { value: 'tag6', name: 'Tag 6' },
                { value: 'tag7', name: 'Tag 7' },
                { value: 'tag8', name: 'Tag 8' },
                { value: 'tag9', name: 'Tag 9' },
                { value: 'tag10', name: 'Tag 10' },
              ]
            },
          },
        }),

      ],
    }),
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
        new InputOption({
          key: 'userConfig.seoTitle',
          label: 'SEO Title',
          input: 'InputText',
          props: { },
        }),
        new InputOption({
          key: 'userConfig.seoDescription',
          label: 'SEO Description',
          input: 'InputText',
          props: { },
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
        :input-props="{ post }"
        @update:model-value="updatePost($event as TablePostConfig)"
      />
    </ElForm>
  </ElTool>
</template>
