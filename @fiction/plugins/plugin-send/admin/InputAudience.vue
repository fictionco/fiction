<script lang="ts" setup>
import type { User, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElBadge from '@fiction/ui/common/ElBadge.vue'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<User[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: User[]): void
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-start gap-2">
      <ElBadge class="shrink-0" size="md" btn="primary" :disabled="true">
        Send to All Active Subscribers
      </ElBadge>
    </div>
  </div>
</template>
