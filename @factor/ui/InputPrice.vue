<template>
  <div class="relative rounded-md shadow-sm">
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <span class="text-input-body-light sm:text-sm"> $ </span>
    </div>
    <input
      type="number"
      :class="classes"
      placeholder="0.00"
      :value="modelValue"
      step=".01"
      min="0"
      @input="handleEmit($event.target)"
    />
  </div>
</template>
<script lang="ts" setup>
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: [String, Number], default: "" },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement
  emit("update:modelValue", el.value)
}

const classes = ["pl-7", ...textInputClasses()]
</script>
