<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { ListItem } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputAddElements from './InputAddElements.vue'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = vue.computed<InputOption[]>(() => {
  return [
    createOption({
      key: 'group.addElements',
      label: 'Click to Add Elements',
      input: 'group',
      icon: { class: 'i-tabler-click' },
      options: [
        createOption({
          key: 'addElementsInputs',
          input: InputAddElements,
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
    title="Add Sections"
    :icon="tool.icon"
    :buttons="[{
      label: 'Manage Layout',
      icon: { class: 'i-tabler-layout' },
      size: 'xs',
      onClick: () => props.controller.useTool({ toolId: 'editLayout' }),
    }]"
  >
    <ElForm class="p-2">
      <FormEngine
        v-model="site.editPageConfig.value"
        :options
        :input-props="{ site, tool }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
