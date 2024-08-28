<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { Site } from '../../site'
import InputManagePages from './InputManagePages.vue'
import type { ToolKeys } from './tools.js'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<ToolKeys>, required: true },
})

const options = [
  new InputOption({ key: 'managePages', label: 'Manage Pages', input: 'group', options: [
    new InputOption({ key: 'managePagesInput', input: InputManagePages }),
  ] }),
  // new InputOption({ key: 'manageLayout', label: 'Page Layout', input: 'group', options: [
  //   new InputOption({ key: 'manageLayoutInput', input: InputManageLayout }),
  // ] }),
  // new InputOption({ key: 'addElements', label: 'Add Elements', input: 'group', options: [
  //   new InputOption({ key: 'addElementsInputs', input: InputAddElements }),
  // ] }),

]
</script>

<template>
  <ElTool :actions="[]" v-bind="props">
    <ElForm>
      <ToolForm :options :input-props="{ site, tool, controller }" />
    </ElForm>
  </ElTool>
</template>
