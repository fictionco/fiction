<script lang="ts" setup>
import type { ActionButton } from '@fiction/core/schemas/schemas.js'
import type { Card } from '@fiction/site'
import type { UiElementSize } from '@fiction/ui/utils'
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import CardButton from '../CardButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  animate: { type: String as vue.PropType<'fade' | 'slide' | 'pop' | 'rise' | 'none'>, default: 'none' },
  isOverlay: { type: Boolean, default: false },
})

const randomId = shortId()

vue.onMounted(() => {
  if (props.animate !== 'none') {
    useElementVisible({
      selector: `#${randomId}`,
      onVisible: async () => {
        await animateItemEnter({ targets: `#${randomId} .x-action-item`, themeId: props.animate, config: { overallDelay: 400 } })
      },
    })
  }
})

function getButtonType(action: ActionButton) {
  if (props.isOverlay) {
    return 'overlay'
  }
  else {
    return action.theme
  }
}
</script>

<template>
  <div v-if="actions?.length" :id="randomId">
    <CardButton
      v-for="(action, i) in actions"
      :key="i"
      :card
      class="x-action-item"
      :theme="getButtonType(action) || 'default'"
      :href="action.href"
      :size="action.size || uiSize"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.disabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.name }}
    </CardButton>
  </div>
</template>
