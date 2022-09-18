<template>
  <div class="text-input-size my-[1em] flex items-center">
    <div class="mr-[1em] w-[2em] text-right">
      {{ modelValue ?? "-" }}
    </div>

    <input
      :class="`w-full h-[.5em] bg-theme-200 rounded-lg appearance-none cursor-pointer text-input-size`"
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @input="handleEmit($event.target)"
    />
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload?: number): void
}>()

const handleEmit = async (target: EventTarget | null): Promise<void> => {
  const el = target as HTMLInputElement
  let v = +el.value

  emit("update:modelValue", v)

  await vue.nextTick()

  // if out of bounds, set to bound. emit undefined first to force re-render
  if (typeof props.min != "undefined" && v < +props.min) {
    v = +props.min
    emit("update:modelValue", v)
  }

  if (typeof props.max != "undefined" && v > +props.max) {
    v = +props.max
    emit("update:modelValue", v)
  }
}
</script>
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
