<template>
  <span class="relative z-0 inline-flex rounded-md shadow-sm">
    <button
      v-for="(r, i) in range"
      :key="i"
      type="button"
      :class="buttonClass(r, i)"
      @click="select(r)"
    >
      {{ r }}
    </button>
  </span>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"

const props = defineProps({
  min: { type: [String, Number], default: "1" },
  max: { type: [String, Number], default: "10" },
  modelValue: { type: [String, Number], default: "" },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: number): void
}>()

const range = vue.computed(() => {
  const out = []
  const min = +props.min
  const max = +props.max
  for (let i = min; i <= max; i++) {
    out.push(i)
  }
  return out
})
const buttonClass = (v: number, i: number): string => {
  const out: string[] = [
    "relative",
    "inline-flex",
    "items-center",
    "border",
    "px-3",
    "py-input-y",
    "text-input-size",
    "focus:z-10",
    "focus:outline-none",
    "focus:border-primary",
  ]

  if (i == 0) {
    out.push("rounded-l-input")
  } else if (i == range.value.length - 1) {
    out.push("rounded-r-input")
  }

  if (i != 0) {
    out.push("-ml-px")
  }

  if (props.modelValue === v) {
    out.push("bg-theme-400 border-theme-600 text-theme-0 z-20")
  } else {
    out.push(
      "bg-theme-100 text-theme-700 border-theme-300 hover:bg-theme-200 hover:border-theme-400 hover:z-20",
    )
  }

  return out.join(" ")
}
const select = (v: number): void => {
  emit("update:modelValue", v)
}
</script>
