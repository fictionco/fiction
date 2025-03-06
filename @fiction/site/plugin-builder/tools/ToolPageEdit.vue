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
import { getPageOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = vue.computed<InputOption[]>(() => {
  const optionGroups = getPageOptions({ site })
  return [
    optionGroups.essentials,
    optionGroups.special,
    optionGroups.seo,
  ]
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2">
      <FormEngine
        v-model="site.editPageConfig.value"
        state-key="pageEdit"
        :options
        :input-props="{ site, tool }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
