<template>
  <label
    class="text-input-size text-theme-700 bg-theme-100 hover:bg-theme-200 hover:border-theme-400 border-input-border inline-flex cursor-pointer items-center overflow-hidden rounded-md border"
    @click.stop
  >
    <div class="p-[.4em]" :for="inputId">
      <span
        class="wrap relative"
        :style="{ background: modelValue || `rgba(255,255,255,.5)` }"
        :class="classes"
      >
        <input
          :id="inputId"
          type="color"
          class="h-[1.3em] w-[1.3em] cursor-pointer opacity-0"
          :value="modelValue || '#dfdfdf'"
          @input="handleEmit($event.target)"
        />
      </span>
    </div>

    <div
      class="inline-flex items-center space-x-2 pl-[.2em] pr-[.4em] text-[.9em]"
    >
      <span class="text-theme-500 hover:text-theme-500">
        {{ modelValue || "Select Color" }}
      </span>
    </div>
  </label>
</template>

<script lang="ts" setup>
import { vue, objectId } from "@factor/api"

const inputId = vue.ref(`id${objectId()}`)
defineProps({
  modelValue: { type: String, default: undefined },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement
  emit("update:modelValue", el.value != "#dfdfdf" ? el.value : "")
}

const classes = [
  "f-color-picker",
  "cursor-pointer",
  "ring-theme-300",
  "ring-2",
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
