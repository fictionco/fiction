<script lang="ts" setup>
import { vue } from '@fiction/core'
import { animateItemEnter } from '@fiction/ui/anim'
import type { StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardButton from '../CardButton.vue'
import type { XButtonProps } from '../schemaSets'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  actions: { type: Array as vue.PropType<XButtonProps[]>, default: () => [] },
  defaultSize: { type: String as vue.PropType<StandardSize>, default: 'xl' },
  justify: { type: String as vue.PropType<'center' | 'left' | 'right'>, default: 'center' },
})

vue.onMounted(() => {
  animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'fade', config: { overallDelay: 400 } })
})
</script>

<template>
  <div
    v-if="actions?.length"
    class="mt-10 flex items-center gap-x-6"
    :class="justify === 'left' ? 'justify-start' : (justify === 'right' ? 'justify-end' : 'justify-start md:justify-center')"
  >
    <CardButton
      v-for="(action, i) in actions"
      :key="i"
      class="x-action-item"
      :card
      :theme="action.theme || 'default'"
      :design="action.design"
      :href="action.href"
      :size="action.size || defaultSize"
      :icon="action.icon"
      :icon-after="action.iconAfter"
    >
      {{ action.name }}
    </CardButton>
  </div>
</template>
