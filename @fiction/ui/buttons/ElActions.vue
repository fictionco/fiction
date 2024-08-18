<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import { shortId, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import type { UiElementSize } from '../utils'
import { animateItemEnter, useElementVisible } from '../anim'

const props = defineProps({
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
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

function getButtonType(action: ActionItem) {
  if (props.isOverlay) {
    return 'overlay'
  }
  else {
    return action.theme || 'default'
  }
}
</script>

<template>
  <div v-if="actions?.length" :id="randomId">
    <XButton
      v-for="(action, i) in actions"
      :key="i"
      class="x-action-item"
      :theme="getButtonType(action)"
      :href="action.href"
      :size="action.size || uiSize"
      :rounding="action.rounding || 'full'"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.isDisabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.name }}
    </XButton>
  </div>
</template>
