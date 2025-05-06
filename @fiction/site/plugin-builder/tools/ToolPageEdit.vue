<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { getPageOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const pageConfig = vue.computed({
  get: () => site.currentPage.value.toConfig(),
  set: (pageConfig) => {
    site.currentPage.value.update(pageConfig, { caller: 'page-edit' })
  },
})

const tempValue = vue.ref<Record<string, any>>({})

const options = vue.computed(() => {
  return getPageOptions({ site, page: pageConfig.value, temp: tempValue.value, editMode: 'edit' })
})
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <FormEngine
      class="my-4"
      state-key="optionsEngine"
      :model-value="pageConfig"
      ui-size="md"
      :options="[options.basic, options.seo]"
      :disable-group-hide="true"
      :input-props="{ site, tool }"
      @update:model-value="pageConfig = $event"
    />
  </ElTool>
</template>
