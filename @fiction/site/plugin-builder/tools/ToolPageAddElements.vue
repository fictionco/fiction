<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { getPageOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const o = getPageOptions({ site })
</script>

<template>
  <ElTool
    :tool
    title="Add Sections"
    :icon="tool.icon"
  >
    <ElForm class="p-4">
      <FormEngine
        v-model="site.editPageConfig.value"
        :options="o.add.options.value"
        :input-props="{ site, tool }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
