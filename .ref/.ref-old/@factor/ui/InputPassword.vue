<template>
  <input
    :class="textInputClasses()"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'current-password'"
    type="password"
    minlength="6"
    @input="handleEmit($event.target)"
  />
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: String, default: "" },
})
const attrs = vue.useAttrs() as { autocomplete: string; [key: string]: any }
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}
</script>
