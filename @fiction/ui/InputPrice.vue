<script lang="ts" setup>
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  currencySymbol: { type: String, default: '$' },
  inputClass: { type: String, default: '' },
  step: { type: String, default: '1' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.value)
}

const classes = ['pl-[2em]', textInputClasses({ inputClass: props.inputClass })]
</script>

<template>
  <div class="relative rounded-md shadow-sm">
    <div
      class="pl-input-x text-theme-500 dark:text-theme-400 text-[1.2em] font-mono pointer-events-none absolute inset-y-0 left-0 flex items-center"
    >
      {{ currencySymbol }}
    </div>
    <input
      type="number"
      :class="classes"
      placeholder="0.00"
      :value="modelValue"
      :step="step"
      min="0"
      v-bind="$attrs"
      @input="handleEmit($event.target)"
    >
  </div>
</template>
