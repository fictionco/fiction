<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { Post } from '../../post.js'
import type { TablePostConfig } from '../../schema.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'

import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputEmailPreview from './InputPreview.vue'

const { tool, post, card } = defineProps<{
  tool: EditorTool
  post?: Post | undefined
  card: Card
}>()

const options = vue.computed<InputOption[]>(() => {
  return [
    new InputOption({ key: '*', input: InputEmailPreview, props: { modelValue: post, card } }),
  ]
})

function updatePost(config: Partial<TablePostConfig>) {
  post?.update(config, { caller: 'ToolEmailPreview' })
}
</script>

<template>
  <ElTool :tool>
    <ElForm v-if="post" id="toolForm">
      <FormEngine
        state-key="emailPreview"
        :model-value="post.toConfig()"
        :options
        :input-props="{ post, card }"
        @update:model-value="updatePost($event as Partial<TablePostConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
