<template>
  <span class="relative z-0 inline-flex rounded-lg shadow-sm">
    <button
      v-for="(li, i) in parsedList"
      :key="i"
      type="button"
      :class="[classes, buttonClass(li, i)]"
      @click="select(li)"
    >
      {{ li.name }}
    </button>
  </span>
</template>
<script lang="ts" setup>
import { normalizeList, ListItem, vue } from "@factor/api"

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
})

const emit = defineEmits(["update:modelValue"])
const parsedList = vue.computed(() => normalizeList(props.list))

const buttonClass = (v: ListItem, i: number): string => {
  const out: string[] = []

  if (i == 0) {
    out.push("rounded-l-md")
  } else if (i == parsedList.value.length - 1) {
    out.push("rounded-r-md")
  }

  if (i != 0) {
    out.push("-ml-px")
  }

  if (props.modelValue == v.value) {
    out.push("bg-theme-400 border-theme-600 text-theme-0 z-20")
  } else {
    out.push(
      "bg-theme-100 text-theme-600 border-theme-300 hover:border-theme-300",
    )
  }

  return out.join(" ")
}
const select = (v: ListItem): void => {
  emit("update:modelValue", v.value)
}

const classes = [
  "relative",
  "inline-flex",
  "items-center",
  "border",
  "px-input-x",
  "py-input-y",
  "text-input-size",

  "text-theme-600",
  "focus:z-10",
  "focus:outline-none",
  "focus:ring-0",
]
</script>
