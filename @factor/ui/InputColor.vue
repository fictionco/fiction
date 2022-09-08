<template>
  <label
    class="text-input-size text-theme-700 bg-theme-100 hover:bg-theme-200 hover:border-theme-400 border-input-border inline-flex cursor-pointer items-center overflow-hidden rounded-md border"
  >
    <div class="py-[.2em] px-[.4em]">
      <div
        class="wrap"
        :style="{ background: modelValue || `#dfdfdf` }"
        :class="classes"
      >
        <input
          v-bind="attrs"
          type="color"
          class="h-[1.6em] w-[1.6em] cursor-pointer opacity-0"
          :value="modelValue || '#dfdfdf'"
          @input="handleEmit($event.target)"
        />
      </div>
    </div>

    <span class="text-theme-700 hover:text-theme-500 p-[.4em]">
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
  modelValue: { type: String, default: undefined },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const attrs = vue.useAttrs()
const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement
  emit("update:modelValue", el.value != "#dfdfdf" ? el.value : "")
}

const classes = [
  "f-color-picker",
  "cursor-pointer",
  "border",
  "border-black/10",
  "rounded-full",
  "active:opacity-75",
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
