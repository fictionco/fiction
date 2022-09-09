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
import { vue } from "@factor/api"
import { textInputClasses } from "./theme"
const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload?: number): void
}>()

const handleEmit = async (target: EventTarget | null): Promise<void> => {
  const el = target as HTMLInputElement
  let v = +el.value

  emit("update:modelValue", v)

  await vue.nextTick()

  // if out of bounds, set to bound. emit undefined first to force re-render
  if (typeof props.min != "undefined" && v < +props.min) {
    v = +props.min
    emit("update:modelValue", v)
  }

  if (typeof props.max != "undefined" && v > +props.max) {
    v = +props.max
    emit("update:modelValue", v)
  }
}
</script>
