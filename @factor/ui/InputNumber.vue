<template>
  <input
    :class="textInputClasses()"
    type="number"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    @input="handleEmit($event.target)"
  />
</template>
<script lang="ts" setup>
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: [String, Number], default: "" },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: number): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", +el.value)
}
</script>
