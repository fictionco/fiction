<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { Post } from '../post'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { site, post, tool } = defineProps<{
  site: Site
  post: Post
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
  saveText: string
}>()

const options: InputOption[] = [
  createOption({
    key: 'post.revision',
    label: 'Revision History',
    input: 'group',
    icon: { class: 'i-tabler-history' },
    options: [
      createOption({
        key: 'group.revision',
        label: 'Post Revisions',
        input: 'group',
        icon: { class: 'i-tabler-history' },
        options: [
          createOption({
            key: 'revisionHistory',
            input: vue.defineAsyncComponent(() => import('./InputRevisionHistory.vue')),
            props: { site, post, tool },
          }),
        ],
      }),

    ],
  }),

]
</script>

<template>
  <ElTool v-bind="{ tool, site }">
    <FormEngine state-key="revision" :options :input-props="{ site, tool, post }" />
  </ElTool>
</template>
