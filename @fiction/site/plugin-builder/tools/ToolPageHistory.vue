<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const options: InputOption[] = [
  createOption({
    key: 'editor.revision',
    label: 'Site Revision History',
    input: 'group',
    icon: { class: 'i-tabler-history' },
    options: [
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

    ],
  }),

]
</script>

<template>
  <ElTool v-bind="props">
    <FormEngine state-key="revision" :options :input-props="{ site, tool }" />
  </ElTool>
</template>
