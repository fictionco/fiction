<template>
  <input
    :class="textInputClasses()"
    type="text"
    :value="modelValue"
    spellcheck="false"
    @input="handleEmit($event.target)"
  />
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
</script>
