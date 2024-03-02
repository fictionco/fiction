<script lang="ts" setup>
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  currencySymbol: { type: String, default: '$' },
  inputClass: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.value)
}

const classes = ['pl-[2em]', ...textInputClasses({ inputClass: props.inputClass })]
</script>

<template>
  <div class="relative rounded-md shadow-sm">
    <div
      class="pl-input-x text-theme-500 text-input-size pointer-events-none absolute inset-y-0 left-0 flex items-center"
    >
      {{ currencySymbol }}
    </div>
    <input
      type="number"
      :class="classes"
      placeholder="0.00"
      :value="modelValue"
      step=".01"
      min="0"
      v-bind="$attrs"
      @input="handleEmit($event.target)"
    >
  </div>
</template>
