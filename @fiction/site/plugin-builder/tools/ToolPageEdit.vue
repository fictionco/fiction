<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import { vue } from '@fiction/core'
import TabbedOptions from '@fiction/ui/inputs/TabbedOptions.vue'
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
  return getPageOptions({ site, page: pageConfig.value, temp: tempValue.value, includeHomeOption: true })
})
</script>

<template>
  <TabbedOptions
    v-model="pageConfig"
    title="Current Page Settings"
    :options="[options.basic, options.seo]"
    :input-props="{ site, tool }"
    @update:temp-value="tempValue = $event"
    @done="site.editorActivateTool({ toolId: '' })"
  />
</template>
