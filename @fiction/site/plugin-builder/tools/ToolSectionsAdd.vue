<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import InputAddElements from './InputAddElements.vue'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props
</script>

<template>
  <ElTool
    :tool
    title="Add Sections"
    :icon="tool.icon"
  >
    <ElForm class="p-4">
      <InputAddElements :site :tool />
    </ElForm>
  </ElTool>
</template>
