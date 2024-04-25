<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter } from '@fiction/ui/anim'
import CardElement from '../CardElement.vue'

type UserConfig = {
  actions?: ActionItem[]
} & Record<string, unknown>

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  defaultSize: { type: String, default: 'xl' },
  justify: { type: String as vue.PropType<'center' | 'left' | 'right'>, default: 'center' },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

vue.onMounted(() => {
  animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'pop', config: { overallDelay: 400 } })
})
</script>

<template>
  <div
    v-if="uc.actions?.length"
    class="mt-10 flex items-center gap-x-6"
    :class="justify === 'left' ? 'justify-start' : (justify === 'right' ? 'justify-end' : 'justify-center')"
  >
    <CardElement
      v-for="(action, i) in uc.actions"
      :key="i"
      class="x-action-item"
      :card="card"
      theme-el="button"
      :btn="action.btn || 'default'"
      :href="action.href"
      :size="action.size || defaultSize"
    >
      {{ action.name }}
    </CardElement>
  </div>
</template>
