<template>
  <label class="text-input-size inline-flex cursor-pointer items-center">
    <div
      class="wrap"
      :style="{ background: modelValue || `#dfdfdf` }"
      :class="classes"
    >
      <input
        v-bind="attrs"
        type="color"
        class="h-[2em] w-[2em] cursor-pointer opacity-0"
        :value="modelValue"
        @input="handleEmit($event.target)"
      />
    </div>

    <span class="text-theme-700 hover:text-theme-500">
      {{ modelValue || "Select Color" }}
    </span>
  </label>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { vue } from "@factor/api"

defineProps({
  modelValue: { type: String, default: "" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const attrs = vue.useAttrs()
const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement
  emit("update:modelValue", el.value)
}

const classes = [
  "f-color-picker",
  "cursor-pointer",
  "mt-0.5",
  "mr-[.9em]",
  "rounded-full",
  "active:opacity-75",
  "ring-2",
  "ring-white",
  "flex",
]
</script>
<style lang="less">
.f-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}
.f-color-picker::-webkit-color-swatch {
  border: none;
}
</style>
