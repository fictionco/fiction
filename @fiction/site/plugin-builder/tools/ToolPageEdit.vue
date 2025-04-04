<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import TabbedOptions from '@fiction/ui/inputs/TabbedOptions.vue'
import { getPageOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = getPageOptions({ site })
</script>

<template>
  <TabbedOptions
    v-model="site.editPageConfig.value"
    title="Current Page Settings"
    :options="[options.basic, options.seo]"
    :input-props="{ site, tool }"
  />
</template>
