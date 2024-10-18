<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '../anim'
import XButton from '../buttons/XButton.vue'

const props = defineProps({
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  animate: { type: String as vue.PropType<'fade' | 'slide' | 'pop' | 'rise' | 'none'>, default: 'none' },
  isOverlay: { type: Boolean, default: false },
})

const randomId = shortId()

vue.onMounted(() => {
  if (props.animate !== 'none') {
    useElementVisible({
      caller: 'ElActions',
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
      :data-test-id="action.testId"
      :theme="getButtonType(action)"
      :href="action.href"
      :size="action.size || uiSize"
      :rounding="action.rounding || 'full'"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.disabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.name }}
    </XButton>
  </div>
</template>
