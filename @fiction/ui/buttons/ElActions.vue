<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElButton from '../ElButton.vue'

defineProps({
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})
//
</script>

<template>
  <div v-if="actions?.length">
    <ElButton
      v-for="(action, i) in actions"
      :key="i"
      :btn="action.btn || 'default'"
      :href="action.href"
      :size="action.size || 'md'"
    >
      {{ action.name }}
    </ElButton>
  </div>
</template>
