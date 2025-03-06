<script lang="ts" setup>
import type { Handle } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { Card } from '../../card'
import type { Site } from '../../site'
import ElToolHandle from '@fiction/admin/tools/ElToolHandle.vue'
import { toLabel } from '@fiction/core'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
  regionId: { type: String, required: true },
  scope: { type: String, default: undefined },

})

function getCardHandle(card: Card): Handle {
  const { icon } = card.tpl.value?.settings || {}
  return {
    testId: `layout-card-${card.templateId.value}`,
    title: card.tpl.value?.settings.title ?? 'Card',
    subTitle: card.isDetached.value ? '(detached)' : '',
    sub: card.title.value,
    handleId: card.cardId,
    icon: typeof icon === 'string' ? { class: icon } : icon,
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
        label: 'Edit',
        icon: 'i-tabler-pencil',
        onClick: () => {
          props.site.setActiveCard({ cardId: card.cardId })
        },
      },
      {
        label: 'Delete',
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
    <div
      class="relative mb-1.5 flex justify-between items-center"
      :class="[scope === 'global' ? 'text-theme-500/70 dark:text-theme-400/70' : 'text-primary-500 dark:text-primary-500']"
    >
      <div class="z-10 pr-3 text-xs flex gap-1 items-center font-medium whitespace-nowrap">
        {{ toLabel(regionId) }} Region
      </div>
      <div
        class="inset-0 flex items-center w-full"
        aria-hidden="true"
      >
        <div
          class="w-full border-t border-dashed "
          :class="[scope === 'global' ? 'border-theme-100/70 dark:border-theme-700' : 'border-primary-100/70 dark:border-primary-700']"
        />
      </div>
      <div class="z-10 pl-3 text-xs flex gap-1 items-center   font-medium whitespace-nowrap">
        {{ scope === 'global' ? 'All Pages' : 'Current Page' }}
      </div>
    </div>

    <div class="relative">
      <EffectTransitionList
        tag="div"
        class="space-y-2 sortable-zone min-h-[30px] rounded-md"
        data-drag-zone
        data-drag-depth="1"
        :disabled="site.isAnimationDisabled.value"
      >
        <ElToolHandle
          v-for="cardObj in card.cards.value"
          :key="cardObj.cardId"
          class="w-full"
          :handle="getCardHandle(cardObj)"
        />
      </EffectTransitionList>
    </div>
  </div>
</template>
