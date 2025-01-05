<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '../anim'
import XButton from './XButton.vue'

const props = defineProps({
  buttons: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  animate: { type: String as vue.PropType<'fade' | 'slide' | 'pop' | 'rise' | 'none'>, default: 'none' },
  isOverlay: { type: Boolean, default: false },
})

const randomId = shortId()

vue.onMounted(() => {
  if (props.animate !== 'none') {
    useElementVisible({
      caller: 'XButtonList',
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
  <div v-if="buttons?.length" :id="randomId">
    <XButton
      v-for="(btn, i) in buttons"
      :key="btn.testId || `btn-${i}`"
      class="x-action-item"
      :data-test-id="btn.testId"
      :theme="getButtonType(btn)"
      :design="btn.design || 'solid'"
      :hover="btn.hover || 'fade'"
      :href="btn.href"
      :size="btn.size || uiSize"
      :rounding="btn.rounding || 'full'"
      :icon="btn.icon"
      :loading="btn.loading"
      :icon-after="btn.iconAfter"
      :disabled="btn.disabled"
      @click.stop="btn.onClick && btn.onClick({ event: $event, item: btn })"
    >
      {{ btn.label }}
    </XButton>
  </div>
</template>
