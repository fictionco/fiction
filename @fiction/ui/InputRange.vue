<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
  prefix: { type: String, default: '' },
  hideValue: { type: Boolean, default: false },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload?: number): void
}>()

async function handleEmit(target: EventTarget | null): Promise<void> {
  const el = target as HTMLInputElement
  let v = +el.value

  emit('update:modelValue', v)

  await vue.nextTick()

  // if out of bounds, set to bound. emit undefined first to force re-render
  if (props.min !== undefined && v < +props.min) {
    v = +props.min
    emit('update:modelValue', v)
  }

  if (props.max !== undefined && v > +props.max) {
    v = +props.max
    emit('update:modelValue', v)
  }
}

const hasValue = vue.computed(() => {
  return typeof props.modelValue !== 'undefined'
})
</script>

<template>
  <div class="text-input-size max-w-input flex items-center">
    <span
      v-if="!hideValue"
      class="bg-theme-200 text-theme-600 mr-[1em] inline-flex items-center space-x-1 rounded-full px-[1em] py-[.2em] text-right text-[10px] font-mono font-medium"
    >
      <span v-if="prefix" class="opacity-80 truncate">{{ prefix }}:</span>
      <span v-if="hasValue">
        {{ modelValue }}
      </span>
      <span v-else class="i-tabler-line-dashed text-sm" />
    </span>

    <input
      class="w-full h-[.5em] bg-theme-200 rounded-lg appearance-none cursor-pointer text-input-size"
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @input="handleEmit($event.target)"
    >
  </div>
</template>

<style lang="less">
input[type="range"]::-webkit-slider-thumb {
  @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
}
input[type="range"]::-moz-range-thumb {
  @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
}
input[type="range"]::-ms-thumb {
  @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
}
</style>
