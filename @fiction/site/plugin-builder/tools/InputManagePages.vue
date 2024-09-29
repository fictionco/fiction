<script lang="ts" setup>
import type { AdminEditorController, EditorTool, Handle } from '@fiction/admin'
import type { ActionItem } from '@fiction/core'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import EffectDraggableSort from '@fiction/admin/el/EffectDraggableSort.vue'
import ElToolBanner from '@fiction/admin/tools/ElToolBanner.vue'
import ELToolHandle from '@fiction/admin/tools/ElToolHandle.vue'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { saveSite } from '../../utils/site'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

function useEditPage(args: { cardId?: string } = {}) {
  const { cardId } = args

  if (cardId)
    props.site.activePageId.value = cardId

  props.site.editor.value.selectedPageId = cardId || ''

  props.controller.useTool({ toolId: cardId ? 'editPage' : 'addPage' })
}

const actions: ActionItem[] = [
  {
    name: 'New Page',
    icon: 'i-tabler-circle-plus',
    onClick: () => useEditPage(),
  },
]

const handles = vue.computed(() => {
  const pg = props.site.pages.value.filter(_ => !_.isSystem.value) || []
  return pg.map((pg): Handle => {
    const cardId = pg.cardId
    const actions: ActionItem[] = [{
      name: 'Settings',
      icon: 'i-tabler-edit',
      onClick: () => useEditPage({ cardId }),
    }]

    if (pg.slug.value === '_home') {
      actions.unshift({ name: 'View', icon: 'i-tabler-home' })
    }
    return {
      testId: `page-${pg.slug.value}`,
      title: pg.displayTitle.value,
      icon: 'i-tabler-file',
      handleId: cardId ?? 'no-id-provided',
      depth: 0,
      isActive: cardId === props.site.activePageId.value,
      onClick: () => { useEditPage({ cardId }) },
      actions,
    }
  })
})

async function handleSorted(sorted: string[]) {
  props.site.editor.value.savedCardOrder.main = sorted
  await saveSite({ site: props.site, onlyKeys: ['editor'], successMessage: '' })
}
</script>

<template>
  <div>
    <ElToolBanner
      v-if="handles.length === 0"
      title="Add New Page"
      sub="Click the add button above to add your first page."
      :icon="tool.icon"
      :actions
    />
    <template v-else>
      <div>
        <EffectDraggableSort class="space-y-2" @update:sorted="handleSorted($event)">
          <ELToolHandle
            v-for="handle in handles"
            :key="handle.handleId"
            class="drag-handle w-full"
            :handle="handle"
            :data-drag-id="handle.handleId"
          />
        </EffectDraggableSort>
        <div class="flex justify-end mt-4">
          <XButton
            data-test-id="addPage"
            theme="primary"
            size="xs"
            icon="i-tabler-circle-plus"
            rounding="full"
            @click="useEditPage()"
          >
            Add Page
          </XButton>
        </div>
      </div>
    </template>
  </div>
</template>
