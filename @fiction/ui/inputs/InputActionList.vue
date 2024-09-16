<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const props = defineProps({
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<ActionItem['size']>, default: 'sm' },
})

function gapSize() {
  switch (props.uiSize) {
    case 'xs':
      return 'gap-2'
    case 'sm':
      return 'gap-3'
    case 'md':
      return 'gap-4'
    case 'lg':
      return 'gap-4'
    case 'xl':
      return 'gap-5'
    default:
      return 'gap-2'
  }
}
</script>

<template>
  <div class="flex items-center flex-wrap py-2" :class="gapSize()">
    <XButton
      v-for="(action, i) in actions"
      :key="i"
      :theme="action.theme || 'default'"
      :size="action.size || uiSize"
      :loading="action.loading"
      :href="action.href"
      :target="action.target"
      :icon="action.icon"
      :icon-after="action.iconAfter"
      @click.stop.prevent="action.onClick ? action.onClick({ event: $event, props: { ...props, ...$attrs } }) : ''"
    >
      {{ action.name }}
    </XButton>
  </div>
</template>
