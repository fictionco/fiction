<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const options: InputOption[] = [
  createOption({
    key: 'group.subDomain',
    label: 'Revisions',
    input: 'group',
    icon: { class: 'i-tabler-history' },
    options: [
      createOption({
        key: 'revisionHistory',
        input: vue.defineAsyncComponent(() => import('./InputRevisionHistory.vue')),
      }),
    ],
  }),
]
</script>

<template>
  <ElTool
    :tool
    :title="tool.title"
    :icon="tool.icon"
  >
    <ElForm class="p-2">
      <FormEngine
        state-key="revision"
        :options
        :input-props="{ site, tool }"
        :depth="1"
      />
    </ElForm>
  </ElTool>
</template>
