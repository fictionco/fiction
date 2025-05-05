<script setup lang="ts">
import { resetUi, vue } from '@fiction/core'
import { Card } from '@fiction/site/card'
import CardToolDropdown from './CardToolDropdown.vue'
import EffectTransitionCardList from './EffectTransitionCardList.vue'

const { card, tag = 'div', isEditable = false } = defineProps<{ card?: Card, tag?: string, isEditable?: boolean }>()

function handleCardClick(args: { cardId: string, event: MouseEvent }) {
  const { event, cardId } = args

  if (isEditable) {
    event?.stopPropagation()
    resetUi({ scope: 'all', cause: 'ElEngine', trigger: 'elementClick' })
    card?.site?.setActiveCard({ cardId })
  }
}

const renderCards = vue.computed(() => {
  const c = card?.cards.value || []

  const site = card?.site
  const currentItemId = site?.currentItemId.value

  const out = tag === 'main'
    ? c.filter((c) => {
        if (c.isDetached.value) {
          return true
        }

        const uc = c.fullConfig.value
        const showOnSingle = uc.standard?.showOnSingle
        const hideOnPage = uc.standard?.hideOnPage
        return (currentItemId && showOnSingle) || (!currentItemId && !hideOnPage)
      })
    : c

  if (out.length === 0 && currentItemId && tag === 'main') {
    out.push(new Card({ templateId: 'card404ErrorV1', site: card?.site }))
  }

  return {
    display: out.filter(c => !c.isDetached.value),
    detached: out.filter(c => c.isDetached.value),
  }
})
</script>

<template>
  <component :is="tag" class="card-engine" :data-total-cards="card?.cards.value.length">
    <EffectTransitionCardList>
      <div
        v-for="(subCard) in renderCards.display"
        :key="subCard.cardId"
        :card="subCard"
        class="relative group/engine"
        :class="[
          card?.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
          isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-primary-300 dark:hover:outline-primary-600 cursor-pointer  transition-all' : '',
        ]"
        @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
      >
        <component
          :is="subCard.tpl.value?.settings?.el"
          :id="subCard.cardId"
          :data-card-id="subCard.cardId"
          data-test-id="card-engine-component"
          :data-card-type="subCard.templateId.value"
          :card="subCard"
        />
        <CardToolDropdown
          v-if="isEditable && subCard"
          :card="subCard"
          class="absolute top-3 opacity-0 group-hover/engine:opacity-100"
          :class="subCard.tpl.value?.settings.isContainer ? 'left-3' : 'right-3'"
        />
      </div>
    </EffectTransitionCardList>
    <component
      :is="subCard.tpl.value?.settings?.el"
      v-for="(subCard) in renderCards.detached"
      :id="subCard.cardId"
      :key="subCard.cardId"
      data-test-id="card-non-inline-component"
      :data-card-type="subCard.templateId.value"
      :card="subCard"
    />
  </component>
</template>
