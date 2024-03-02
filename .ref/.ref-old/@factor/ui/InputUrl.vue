<template>
  <input
    :class="textInputClasses()"
    type="url"
    :value="modelValue"
    autocomplete="on"
    name="url"
    :placeholder="placeholder"
    @input="handleEmit($event.target)"
  />
</template>
<script lang="ts" setup>
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: [String], default: "" },
  placeholder: { type: [String], default: "https://" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}
</script>
