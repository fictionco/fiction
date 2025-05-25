<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import InputAddElements from './InputAddElements.vue'
import InputManageLayout from './InputManageLayout.vue'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

vue.onMounted(() => {
  if (!site.editingPageId.value) {
    site.editingPageId.value = site.activePageId.value
  }
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="px-4 py-8 space-y-10">
      <ElInput label="Edit Page Layout" sub-label="Drag and drop to rearrange sections">
        <InputManageLayout class="my-2" :site :tool />
      </ElInput>
      <ElInput label="Add New Sections">
        <InputAddElements class="my-2" :site :tool />
      </ElInput>
    </ElForm>
  </ElTool>
</template>
