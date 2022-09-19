<template>
  <label class="text-input-size inline-flex cursor-pointer items-center">
    <input
      v-bind="attrs"
      type="checkbox"
      :class="classes"
      :checked="modelValue"
      @input="handleEmit($event.target)"
    />

    <span class="checkbox-label text-theme-700 hover:text-theme-500">
      <template v-if="slots.default"> <slot /></template>
      <template v-else>{{ text }}</template>
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
  modelValue: { type: Boolean, default: false },
  text: { type: String, default: "" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: boolean): void
}>()

const attrs = vue.useAttrs()
const slots = vue.useSlots()
const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement
  emit("update:modelValue", el.checked)
}

const classes = [
  "form-checkbox",
  "cursor-pointer",

  "mr-[.8em]",
  "h-[1.1em]",
  "w-[1.1em]",
  "appearance-none",
  "rounded-[.25em]",
  "border",
  "focus:outline-none",
  "focus:ring-0",
  "border-theme-300",
  "text-theme-500",
  "bg-theme-100",
  "text-theme-700",
  "hover:theme-200",
]
</script>
