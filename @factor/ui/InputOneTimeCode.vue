<template>
  <input
    :class="textInputClasses()"
    type="text"
    autocomplete="one-time-code"
    placeholder=""
    size="6"
    :value="modelValue"
    @input="handleEmit($event.target)"
  />
</template>
<script lang="ts" setup>
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: [String], default: "" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}
</script>
