<script lang="ts" setup>
import type { ActionItem, ListItem } from '@fiction/core'
import { toLabel, vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import type { Site } from '../site'
import type { Card } from '../card'
import type { EditorTool, Handle } from './tools'
import ElTool from './ElTool.vue'
import ElToolHandle from './ElToolHandle.vue'
import TransitionList from './TransitionList.vue'
import DraggableLayout from './LayoutDraggable.vue'

const props = defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    required: true,
  },
  tool: {
    type: Object as vue.PropType<EditorTool>,
    required: true,
  },
})

const control = props.site.settings.factorSites
function getCardHandle(card: Card): Handle {
  return {
    title: card.tpl.value?.settings.title ?? 'Card',
    sub: card.title.value,
    handleId: card.cardId,
    icon: card.tpl.value?.settings.icon,
    iconTheme: card.tpl.value?.settings.iconTheme,
    depth: card.depth.value,
    isDraggable: true,
    hasDrawer: card.tpl.value?.settings.isContainer ?? false,
    handles: card.cards.value.map(c => getCardHandle(c)),
    isActive: card.cardId === props.site.editor.value.selectedCardId,
    actions: [
      {
        name: 'Edit',
        icon: 'i-tabler-edit',
        onClick: () => {
          props.site.setActiveCard({ cardId: card.cardId })
        },
      },
      {
        name: 'Delete',
        icon: 'i-tabler-trash',
        onClick: () => {
          props.site.removeCard({ cardId: card.cardId })
        },
      },
    ],
  }
}

const actions: ActionItem[] = [
  {
    name: 'Add Elements',
    icon: 'i-tabler-new-section',
    onClick: () => {
      props.site.activeRegionKey.value = 'main'
      control.useTool({ toolId: 'add' })
    },
  },
]

const pageList = vue.computed<ListItem[]>(() => {
  return props.site.pages.value.map((r) => {
    return {
      name: r.displayTitle.value || 'Untitled',
      value: r.cardId,
    }
  })
})
</script>

<template>
  <ElTool :tool="tool" :actions="actions">
    <div class="list relative p-4">
      <ElInput
        v-model="site.activePageId.value"
        label="Selected Page"
        input="InputSelectCustom"
        :list="pageList"
        class="mb-8"
      />

      <DraggableLayout class="relative rounded-md" @update:model-value="site.updateLayout({ order: $event })">
        <div
          v-for="(card, regionId) in site.layout.value"
          :key="regionId"
          class="pb-4"
          :data-region-id="card.cardId"
        >
          <div class="relative my-1">
            <div
              class="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div class="w-full border-t border-theme-200 dark:border-theme-600" />
            </div>
            <div class="relative flex justify-start">
              <span
                class="bg-white dark:bg-theme-900 pr-2 text-[10px] uppercase text-theme-300"
              >{{ toLabel(regionId) }}</span>
            </div>
          </div>

          <div class="relative">
            <div
              v-if="!card.cards.value.length"
              key="add"
              class="hidden border-3 border-dashed border-theme-200 rounded-lg mt-2 p-4 text-xs text-center hover:border-theme-300 cursor-pointer text-theme-300 hover:text-theme-400 font-semibold"
              @click="site.activeRegionKey.value = regionId; control.useTool({ toolId: 'add' })"
            >
              Add Element
            </div>
            <TransitionList
              tag="div"
              class="space-y-2 sortable-zone min-h-[30px] rounded-md"
              data-drag-zone
              data-drag-depth="1"
              :disabled="site.isAnimationDisabled.value"
            >
              <ElToolHandle
                v-for="cardObj in card.cards.value"
                :key="cardObj.cardId"
                :handle="getCardHandle(cardObj)"
              />
            </TransitionList>
          </div>
        </div>
      </DraggableLayout>
    </div>
  </ElTool>
</template>
