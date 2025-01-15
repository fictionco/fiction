<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

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

        ],
      }),

    ],
  }),

]
</script>

<template>
  <ElTool v-bind="props">
    <FormEngine state-key="revision" :options :input-props="{ site, tool }" />
  </ElTool>
</template>
