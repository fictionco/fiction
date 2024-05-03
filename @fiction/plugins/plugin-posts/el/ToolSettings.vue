<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'

import ElToolBanner from '@fiction/admin/ElToolBanner.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/ElTool.vue'

defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const actions: ActionItem[] = [
  {
    name: 'New Page',
    icon: 'i-tabler-circle-plus',
    onClick: () => {},
  },
]

const handles = vue.computed(() => {
  return []
})
</script>

<template>
  <ElTool :tool="tool" :actions="actions">
    <div class="p-4">
      <ElToolBanner
        v-if="handles.length === 0"
        title="Add New Page"
        sub="Click the add button above to add your first page."
        :icon="tool.icon"
        :actions="actions"
      />
      <template v-else>
        <div>
          111
        </div>
      </template>
    </div>
  </ElTool>
</template>
