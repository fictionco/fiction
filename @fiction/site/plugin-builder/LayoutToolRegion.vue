<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { toLabel } from '@fiction/core'
import type { Site } from '../site'
import type { Card } from '../card'
import type { Handle } from './tools'
import ElToolHandle from './ElToolHandle.vue'
import TransitionList from './TransitionList.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
  regionId: { type: String, required: true },
})

const control = props.site.settings.fictionSites
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
    onClick: () => {
      props.site.setActiveCard({ cardId: card.cardId })
    },
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
</script>

<template>
  <div
    :key="regionId"
    :data-region-id="card.cardId"
  >
    <div class="relative my-1">
      <div
        class="absolute inset-0 flex items-center"
        aria-hidden="true"
      >
        <div class="w-full border-t border-dashed border-theme-100/70 dark:border-theme-600" />
      </div>
      <div class="relative flex justify-start">
        <span
          class="bg-white dark:bg-theme-900 pr-2 text-[10px] uppercase text-theme-400 font-semibold tracking-wide"
        >{{ toLabel(regionId) }}</span>
      </div>
    </div>

    <div class="relative">
      <div
        v-if="!card.cards.value.length"
        key="add"
        class="hidden border-3 border-dashed border-theme-200 dark:border-theme-700 rounded-lg mt-2 p-4 text-xs text-center hover:border-theme-300 cursor-pointer text-theme-300 hover:text-theme-400 font-semibold"
        @click="site.activeRegionKey.value = regionId; control.builder.useTool({ toolId: 'add' })"
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
</template>
