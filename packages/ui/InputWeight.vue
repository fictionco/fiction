<template>
  <span class="relative z-0 inline-flex rounded-md shadow-sm">
    <button
      v-for="(r, i) in range"
      :key="i"
      type="button"
      class="relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      :class="buttonClass(r, i)"
      @click="select(r)"
    >
      {{ r }}
    </button>
  </span>
</template>
<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
  min: { type: String, default: "1" },
  max: { type: String, default: "10" },
  modelValue: { type: [String, Number], default: "" },
})

const emit = defineEmits(["update:modelValue"])
const range = computed(() => {
  const out = []
  const min = Number.parseInt(props.min)
  const max = Number.parseInt(props.max)
  for (let i = min; i <= max; i++) {
    out.push(i)
  }
  return out
})
const buttonClass = (v: number, i: number): string => {
  const out: string[] = []

  if (i == 0) {
    out.push("rounded-l-md")
  } else if (i == range.value.length - 1) {
    out.push("rounded-r-md")
  }

  if (i != 0) {
    out.push("-ml-px")
  }

  if (props.modelValue == v) {
    out.push("bg-primary-500 text-white border-primary-500")
  } else {
    out.push("bg-white border-slate-300 hover:bg-slate-50")
  }

  return out.join(" ")
}
const select = (v: number): void => {
  emit("update:modelValue", v)
}
</script>
