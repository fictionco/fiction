<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'
import type { TablePostConfig } from '@fiction/posts/schema'
import type { Email } from '../email.js'
import type { FictionSend } from '../index.js'
import { getEmailManageOptions } from './tools.js'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  email: { type: Object as vue.PropType<Email>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const options = vue.computed(() => {
  const email = props.email

  return getEmailManageOptions({ email, card: props.card, fictionSend })
})

function updatePost(config: TablePostConfig) {
  props.email?.update(config)
}
</script>

<template>
  <ElTool :tool="tool">
    <ElForm v-if="email" id="toolForm">
      <ToolForm
        :model-value="email.toConfig()"
        :options="options"
        :input-props="{ email, card }"
        @update:model-value="updatePost($event as TablePostConfig)"
      />
    </ElForm>
  </ElTool>
</template>
