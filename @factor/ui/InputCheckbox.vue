<template>
  <label class="f-input inline-flex cursor-pointer">
    <input
      v-bind="attrs"
      type="checkbox"
      :class="classes"
      :checked="modelValue"
      @input="handleEmit($event.target)"
    />

    <span
      class="checkbox-label text-input-size text-input-body hover:text-input-body-light"
    >
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
  "mt-0.5",
  "h-4",
  "w-4",
  "appearance-none",
  "rounded-md",
  "border",
  "focus:outline-none",
  "focus:ring-0",
  "border-input-edge",
  "text-input-primary",
  "bg-input-base",
  "text-input-body",
  "hover:bg-input-base-alt",
]
</script>
