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
    out.push("bg-input-primary  border-input-primary text-input-primary-body")
  } else {
    out.push(
      "bg-input-base text-input-body  border-input-edge hover:border-input-edge",
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
  "text-input-body",
  "focus:z-10",
  "focus:border-input-primary",
  "focus:outline-none",
  "focus:ring-0",
]
</script>
