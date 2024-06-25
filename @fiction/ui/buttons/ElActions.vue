<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElButton from '../ElButton.vue'
import type { UiElementSize } from '../utils'

defineProps({
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})
</script>

<template>
  <div v-if="actions?.length">
    <ElButton
      v-for="(action, i) in actions"
      :key="i"
      :btn="action.btn || 'default'"
      :href="action.href"
      :size="action.size || uiSize"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.isDisabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.name }}
    </ElButton>
  </div>
</template>
