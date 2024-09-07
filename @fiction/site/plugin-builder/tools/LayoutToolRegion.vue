<script lang="ts" setup>
import TransitionList from '@fiction/admin/el/EffectTransitionList.vue'
import ElToolHandle from '@fiction/admin/tools/ElToolHandle.vue'
import { toLabel } from '@fiction/core'
import type { Handle } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { Card } from '../../card'
import type { Site } from '../../site'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
  regionId: { type: String, required: true },
  scope: { type: String, default: undefined },

})

function getCardHandle(card: Card): Handle {
  return {
    testId: `layout-card-${card.templateId.value}`,
    title: card.tpl.value?.settings.title ?? 'Card',
    sub: card.title.value,
    handleId: card.cardId,
    icon: card.tpl.value?.settings.icon,
    colorTheme: card.tpl.value?.settings.colorTheme,
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
        icon: 'i-tabler-pencil',
        onClick: () => {
          props.site.setActiveCard({ cardId: card.cardId })
        },
      },
      {
        name: 'Delete',
        icon: 'i-tabler-x',
        onClick: () => {
          const confirm = window.confirm('Are you sure you want to delete this card?')

          if (!confirm)
            return

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
    <div class="relative my-1 flex justify-between items-center text-theme-400/50">
      <div
        class="absolute inset-0 flex items-center"
        aria-hidden="true"
      >
        <div class="w-full border-t border-dashed border-theme-100/70 dark:border-theme-600" />
      </div>
      <div class="z-10 bg-white dark:bg-theme-900 pr-3 text-[10px] flex gap-1 items-center font-medium ">
        {{ toLabel(regionId) }}
      </div>
      <div class="z-10 bg-white dark:bg-theme-900 pl-3 text-[10px] flex gap-1 items-center   font-medium">
        {{ scope }}
      </div>
    </div>

    <div class="relative">
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
