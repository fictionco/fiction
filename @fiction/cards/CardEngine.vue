<script setup lang="ts">
import { resetUi, toLabel, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import CardWrap from './CardWrap.vue'

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

const cards = vue.computed(() => {
  const c = props.card?.cards.value || []

  return c.filter(c => c.tpl.value?.settings)
})
</script>

<template>
  <component :is="tag" v-if="cards.length" class="card-engine">
    <template v-for="(subCard, i) in cards" :key="i">
      <CardWrap
        data-card-wrap=""
        :card="subCard"
        class="relative group/engine"
        :class="[
          subCard.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
          isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 dark:hover:outline-blue-600 cursor-pointer  transition-all' : '',
        ]"
        @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
      >
        <div v-if="subCard.isNotInline.value && isEditable">
          <div class="p-4">
            <div class="p-3 cursor-pointer hover:opacity-80 dark:text-theme-600 text-theme-400 max-w-md mx-auto rounded-lg font-sans text-sm bg-theme-50 dark:bg-theme-800/50 text-balance text-center" @click="handleCardClick({ cardId: subCard.cardId, event: $event })">
              <div class="font-normal text-theme-700 dark:text-theme-300">
                Placeholder for the popup "{{ toLabel(subCard.templateId.value) }}" Card.  (This won't appear on the live site.)
              </div>
            </div>
          </div>
        </div>
        <component
          :is="subCard.tpl.value?.settings?.el"
          :id="subCard.cardId"
          :data-card-type="subCard.templateId.value"
          :card="subCard"
        />
        <div
          v-if="isEditable"
          class="opacity-0 group-hover/engine:opacity-100 transition-all bg-blue-600/50 hover:bg-blue-600/80 hover:z-20 cursor-pointer py-[1px] px-1.5 text-blue-100 font-sans text-[10px] absolute top-0 right-0 flex gap-0.5 items-center justify-center"
          :class="subCard.tpl.value?.settings.isContainer ? 'left-1' : 'right-1'"
        >
          <div :class="subCard.tpl.value?.settings.icon" />
          <div>{{ subCard.tpl.value?.settings.title }}</div>
        </div>
      </CardWrap>
    </template>
  </component>
</template>
