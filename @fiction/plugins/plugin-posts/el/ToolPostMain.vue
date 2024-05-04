<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import ToolForm from '@fiction/admin/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/ElTool.vue'
import { InputOption } from '@fiction/ui'
import type { Post } from '../post'
import type { TablePostConfig } from '../schema'
import { tableNames } from '../schema'

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
      key: 'status',
      label: 'Publication Status',
      input: 'InputSelectCustom',
      list: ['draft', 'published', 'archived', 'hidden'],
    }),
    new InputOption({
      key: 'slug',
      label: 'Slug',
      input: 'InputUsername',
      placeholder: 'my-post',
      isRequired: true,
      props: {
        table: tableNames.posts,
        columns: [{ name: 'slug' }, { name: 'orgId', value: activeOrganizationId }],
      },
    }),

    new InputOption({
      key: 'date',
      label: 'Publication Date',
      description: 'For display and SEO purposes only.',
      input: 'InputDate',
      props: { },
    }),

    new InputOption({
      key: 'postContentGroup',
      label: 'Post Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'thumbnail',
          label: 'Post Image',
          description: 'The image that will be displayed with the post',
          input: 'InputMediaDisplay',
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
</script>

<template>
  <ElTool v-if="post" :tool="tool" :actions="actions">
    <div class="p-4">
      <ToolForm
        :model-value="post.toConfig()"
        :options="options"
        :input-props="{ post }"
        @update:model-value="post?.update($event as TablePostConfig)"
      />
    </div>
  </ElTool>
</template>
