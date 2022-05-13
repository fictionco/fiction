<template>
  <div class="f-input flex max-w-sm">
    <span :class="protocolClasses"> {{ protocol || "https://" }} </span>

    <input
      v-bind="attrs"
      type="text"
      :class="classes"
      autocomplete="url"
      :value="modelValue"
      @input="handleEmit($event.target)"
    />
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
const attrs = vue.useAttrs()
defineProps({
  modelValue: { type: [String, Number], default: "" },
  protocol: { type: String, default: "https://" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  const v = el.value
    .replace(/^https?:\/\//, "")
    .toLowerCase()
    .replace(" ", "")

  emit("update:modelValue", v)
}

const protocolClasses = [
  "inline-flex",
  "items-center",
  "rounded-l-md",
  "border",
  "border-r-0",
  "text-input-size",
  "border-input-edge",
  "bg-input-base-alt",
  "px-input-x",
  "text-input-body-light",
]
const classes = [
  "block",
  "w-full",
  "flex-1",
  "px-input-x",
  "py-input-y",

  "rounded-none",
  "rounded-r-md",
  "border-input-edge",
  "bg-input-base",
  "text-input-size",
  "placeholder:text-input-placeholder",
  "focus:border-input-primary",
  "focus:ring-0",
]
</script>
