<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputManageLayout from './InputManageLayout.vue'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = vue.computed<InputOption[]>(() => {
  return [
    createOption({
      key: 'manageLayout',
      label: 'Drag and Drop to Reorder',
      input: 'group',
      icon: { class: 'i-tabler-hand-grab' },
      options: [
        createOption({
          key: 'manageLayoutInput',
          input: vue.defineAsyncComponent(() => import('./InputManageLayout.vue')),
          props: { site, tool },
        }),
      ],
    }),

  ]
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-4">
      <InputManageLayout v-model="site.editPageConfig.value" :site :tool />
    </ElForm>
  </ElTool>
</template>
