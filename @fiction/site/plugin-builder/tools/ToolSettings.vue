<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import { vue } from '@fiction/core'
import TabbedOptions from '@fiction/ui/inputs/TabbedOptions.vue'
import { updateSite } from '../../utils/site'
import { getSiteOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
  card: Card
}>()

const v = vue.computed({
  get: () => props.site.toConfig(),
  set: async (v) => {
    await updateSite({ site: props.site, newConfig: v, caller: 'updateGlobalSettings' })
  },
})

const options = getSiteOptions(props)
</script>

<template>
  <TabbedOptions
    v-model="v"
    title="Site Settings"
    :options="[options.global, options.history]"
    :input-props="{ site: props.site, tool: props.tool }"
    @done="site.editorActivateTool({ toolId: '' })"
  />
</template>
