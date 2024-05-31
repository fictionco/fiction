<script setup lang="ts">
import { resetUi, toLabel, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, default: undefined },
  tag: { type: String, default: 'div' },
})

const isEditable = vue.computed(() => {
  return props.card?.site?.isEditable.value
})

function handleCardClick(args: { cardId: string, event: MouseEvent }) {
  const { event, cardId } = args

  if (isEditable.value) {
    event?.stopPropagation()
    resetUi({ scope: 'all', cause: 'ElEngine' })
    props.card?.site?.setActiveCard({ cardId })
  }
}
</script>

<template>
  <component :is="tag" v-if="card?.cards.value.length" class="card-engine">
    <template v-for="(subCard, i) in card?.cards.value" :key="i">
      <div v-if="subCard.isNotInline.value">
        <div v-if="isEditable" class="p-4">
          <div class="p-3 cursor-pointer hover:opacity-80 dark:text-theme-600 text-theme-400 max-w-md mx-auto rounded-lg font-sans text-xs bg-theme-50 dark:bg-theme-800 text-balance text-center" @click="handleCardClick({ cardId: subCard.cardId, event: $event })">
            <div class="font-bold text-theme-700 dark:text-theme-300 mb-2">
              {{ toLabel(subCard.templateId.value) }} Element Placeholder
            </div>
            <div>This element is set to out-of-flow presentation, such as a popup or modal.</div>
          </div>
        </div>
        <component
          :is="subCard.tpl.value?.settings.el"
          :id="subCard.cardId"
          :data-card-type="subCard.templateId.value"
          :card="subCard"
          @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
        />
      </div>
      <div
        v-else
        class="relative group/engine"
        :class="[
          subCard.classes.value.spacingClass,
          subCard.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
          isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 dark:hover:outline-blue-600 cursor-pointer  transition-all' : '',
        ]"
      >
        <component
          :is="subCard.tpl.value?.settings.el"
          :id="subCard.cardId"
          :data-card-type="subCard.templateId.value"
          :card="subCard"
          @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
        />
        <div
          v-if="isEditable"
          class="opacity-0 group-hover/engine:opacity-100 transition-all bg-black/40 hover:bg-black/80 hover:z-20 cursor-pointer py-0.5 px-1.5 text-cyan-50 font-sans text-[10px] absolute top-1 flex gap-0.5 items-center justify-center rounded-md "
          :class="subCard.tpl.value?.settings.isContainer ? 'left-1' : 'right-1'"
          @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
        >
          <div :class="subCard.tpl.value?.settings.icon" />
          <div>{{ subCard.tpl.value?.settings.title }}</div>
        </div>
      </div>
    </template>
  </component>
</template>
