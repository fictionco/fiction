<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import { inputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  currencySymbol: { type: String, default: '$' },
  inputClass: { type: String, default: '' },
  step: { type: String, default: '1' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.value)
}

const cls = vue.computed(() => inputClasses({ uiSize: props.uiSize }))
</script>

<template>
  <div class="relative flex" :class="[cls.base, cls.border, cls.focus, cls.padX, cls.bg, cls.textSize]" tabindex="-1">
    <div
      class="text-[1.2em] font-mono pointer-events-none"
      :class="[cls.padY]"
    >
      {{ currencySymbol }}
    </div>
    <input
      type="number"
      :class="cls.reset"
      class="grow"
      placeholder="0.00"
      :value="modelValue"
      :style="{ fontSize: 'inherit' }"
      :step="step"
      min="0"
      v-bind="$attrs"
      @input="handleEmit($event.target)"
    >
  </div>
</template>
