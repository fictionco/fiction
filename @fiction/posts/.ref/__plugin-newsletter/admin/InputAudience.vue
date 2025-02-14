<script lang="ts" setup>
import type { User, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import XButton from '@fiction/ui/buttons/XButton.vue'

defineProps({
  modelValue: { type: Array as vue.PropType<User[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

defineEmits<{
  (event: 'update:modelValue', payload: User[]): void
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-start gap-2">
      <XButton class="shrink-0" size="md" theme="primary" :disabled="true">
        Send to All Active Subscribers
      </XButton>
    </div>
  </div>
</template>
