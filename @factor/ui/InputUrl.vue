<template>
  <div class="f-input flex">
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
import { textInputClasses } from "./theme"
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
  "border-theme-300",
  "bg-theme-100",
  "px-input-x",
  "text-theme-500",
]
const classes = [
  "flex-1",
  "!rounded-none",
  "!rounded-r-input",
  ...textInputClasses(),
]
</script>
