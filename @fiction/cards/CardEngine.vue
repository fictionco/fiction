<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { resetUi, toLabel, vue } from '@fiction/core'
import CardWrap from './CardWrap.vue'
import EffectTransitionCardList from './EffectTransitionCardList.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, default: undefined },
  tag: { type: String, default: 'div' },
})

const isEditable = vue.computed(() => props.card?.site?.isEditable.value)

function handleCardClick(args: { cardId: string, event: MouseEvent }) {
  const { event, cardId } = args

  if (isEditable.value) {
    event?.stopPropagation()
    resetUi({ scope: 'all', cause: 'ElEngine', trigger: 'elementClick' })
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
    <EffectTransitionCardList>
      <CardWrap
        v-for="(subCard) in cards"
        :key="subCard.cardId"
        :card="subCard"
        :data-sub-card-id="subCard.cardId"
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
                Placeholder for the non-inline "{{ toLabel(subCard.templateId.value) }}" Card.  (Won't appear on the live site.)
              </div>
            </div>
          </div>
        </div>
        <component
          :is="subCard.tpl.value?.settings?.el"
          :id="subCard.cardId"
          data-test-id="card-engine-component"
          :data-card-type="subCard.templateId.value"
          :card="subCard"
        />
      </CardWrap>
    </EffectTransitionCardList>
  </component>
</template>
