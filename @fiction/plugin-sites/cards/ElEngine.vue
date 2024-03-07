<script setup lang="ts">
import { vue } from '@fiction/core'
import type { Card } from '../card'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    default: undefined,
  },
  tag: {
    type: String,
    default: 'div',
  },
})

const isEditable = vue.computed(() => {
  return props.card?.site?.isEditable.value
})
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
        subCard.classes.value.spacing,
        subCard.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300' : '',
        isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 cursor-pointer  transition-all' : '',
      ]"
      :data-card-type="subCard.templateId.value"
      :card="subCard"
      @click="isEditable && card.site?.setActiveCard({ cardId: subCard.cardId })"
    />
  </component>
</template>
