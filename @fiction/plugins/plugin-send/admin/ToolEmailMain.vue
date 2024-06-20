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
import InputAuthors from '@fiction/posts/el/InputAuthors.vue'
import type { Post } from '@fiction/posts/post'
import type { TablePostConfig } from '@fiction/posts/schema'
import type { FictionPosts } from '@fiction/posts'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()

const options = vue.computed(() => {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  return [

    new InputOption({
      key: 'publishAt',
      label: 'Scheduled Send Time',
      input: 'InputDate',
      isRequired: true,
      isHidden: props.post?.status.value !== 'scheduled',
      props: {
        includeTime: true,
        dateMode: 'future',
      },
    }),

    new InputOption({
      key: 'emailContent',
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
                    props.card.goto('/send')
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
  <ElTool v-if="post" :tool="tool">
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
