<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputManagePages from './InputManagePages.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<ToolKeys>, required: true },
})

const { site, tool, controller } = props

const options: InputOption[] = [
  createOption({
    key: 'group.managePages',
    label: 'Pages',
    input: 'group',
    icon: { class: 'i-tabler-file-plus' },
    options: [
      createOption({
        key: 'managePagesInput',
        input: InputManagePages,
        props: { site, tool },
      }),
    ],
  }),
]
</script>

<template>
  <ElTool
    :tool="tool"
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2">
      <FormEngine
        state-key="toolMaster"
        :options
        :input-props="{ site, tool, controller }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
