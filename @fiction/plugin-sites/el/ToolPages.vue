<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import type { Site } from '../site'

import { saveSite } from '../utils/site'
import type { EditorTool, Handle } from './tools'
import ElTool from './ElTool.vue'
import ElToolBanner from './ElToolBanner.vue'
import ELToolHandle from './ElToolHandle.vue'
import DraggableSort from './DraggableSort.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const actions: ActionItem[] = [
  {
    name: 'New Page',
    icon: 'i-tabler-circle-plus',
    onClick: () => props.site.useEditPage(),
  },
]

const handles = vue.computed(() => {
  return props.site.pages.value.map((pg): Handle => {
    const cardId = pg.cardId
    return {
      title: pg.displayTitle.value,
      icon: 'i-tabler-file',
      handleId: cardId ?? 'no-id-provided',
      depth: 0,
      isActive: cardId === props.site.activePageId.value,
      onClick: () => { props.site.activePageId.value = cardId },
      actions: [{
        name: 'Settings',
        icon: 'i-tabler-edit',
        onClick: () => props.site.useEditPage({ cardId }),
      }],
    }
  })
})

async function handleSorted(sorted: string[]) {
  props.site.editor.value.savedCardOrder.main = sorted
  await saveSite({ site: props.site, onlyKeys: ['editor'], successMessage: '' })
}
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
          <DraggableSort class="space-y-2" @update:sorted="handleSorted($event)">
            <ELToolHandle
              v-for="handle in handles"
              :key="handle.handleId"
              class="drag-handle"
              :handle="handle"
              :data-drag-id="handle.handleId"
            />
          </DraggableSort>
        </div>
      </template>
    </div>
  </ElTool>
</template>
