<template>
  <input
    :class="textInputClasses()"
    type="tel"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'tel'"
    @input="handleEmit($event.target)"
  />
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import { textInputClasses } from "./theme"
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

defineProps({
  modelValue: { type: [String], default: "" },
})

const attrs = vue.useAttrs() as { autocomplete: string; [key: string]: string }

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}
</script>
