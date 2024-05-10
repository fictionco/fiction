<script setup lang="ts">
import { resetUi, vue } from '@fiction/core'
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
  <component
    :is="tag"
    v-if="card?.cards.value.length"
    class="card-engine"
  >
    <component
      :is="subCard.tpl.value?.settings.el"
      v-for="(subCard, i) in card?.cards.value"
      :id="subCard.cardId"
      :key="i"
      :class="[
        subCard.classes.value.spacingClass,
        subCard.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
        isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 dark:hover:outline-blue-600 cursor-pointer  transition-all' : '',
      ]"
      :data-card-type="subCard.templateId.value"
      :card="subCard"
      @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
    />
  </component>
</template>
