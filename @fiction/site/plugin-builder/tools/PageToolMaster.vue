<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { Site } from '../../site'
import InputManagePages from './InputManagePages.vue'
import InputManageLayout from './InputManageLayout.vue'
import InputAddElements from './InputAddElements.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<AdminEditorController>, required: true },
})

const options = [

  new InputOption({
    key: 'managePages',
    label: 'Pages',
    input: 'group',
    options: [
      new InputOption({ key: 'managePagesInput', input: InputManagePages }),
    ],
  }),
  new InputOption({
    key: 'manageLayout',
    label: 'Layout',
    input: 'group',
    options: [
      new InputOption({ key: 'manageLayoutInput', input: InputManageLayout }),
    ],
  }),
  new InputOption({
    key: 'addElements',
    label: 'Add',
    input: 'group',
    options: [
      new InputOption({ key: 'addElementsInputs', input: InputAddElements }),
    ],
  }),

]
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm>
      <ToolForm :options="options" :input-props="{ site, tool, controller }" />
    </ElForm>
  </ElTool>
</template>
