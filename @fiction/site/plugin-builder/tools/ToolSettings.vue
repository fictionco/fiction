<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
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
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <FormEngine
      v-model="v"
      class="my-4"
      state-key="optionsEngine"
      ui-size="md"
      :options="[options.global, options.history]"
      :disable-group-hide="true"
      :input-props="{ site: props.site, tool: props.tool }"
    />
  </ElTool>
</template>
