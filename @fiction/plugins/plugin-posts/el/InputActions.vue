<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'

const props = defineProps({
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },

})
</script>

<template>
  <div class="gap-2 flex items-center flex-wrap py-2">
    <ElButton
      v-for="(action, i) in actions"
      :key="i"
      :btn="action.btn || 'default'"
      :size="action.size || 'sm'"
      :loading="action.loading"
      :href="action.href"
      @click.stop="action.onClick ? action.onClick({ event: $event, props: { ...props, ...$attrs } }) : ''"
    >
      {{ action.name }}
    </ElButton>
  </div>
</template>
