<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { Site } from '../../site'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import AiSettings from '../../ai/AiSettings.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
})
</script>

<template>
  <ElTool :actions="[]" v-bind="props">
    <AiSettings :site="site" />
  </ElTool>
</template>
