<template>
  <span class="relative z-0 inline-flex rounded-md shadow-sm">
    <button
      v-for="(li, i) in list"
      :key="i"
      type="button"
      class="relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      :class="buttonClass(li, i)"
      @click="select(li)"
    >
      {{ li.name }}
    </button>
  </span>
</template>
<script lang="ts" setup>
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { PropType, computed } from "vue"

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  list: { type: Array as PropType<ListItem[]>, default: () => [] },
})

const emit = defineEmits(["update:modelValue"])
const parsedList = computed(() => normalizeList(props.list))

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
    out.push("bg-slate-100 text-slate-900 border-slate-400")
  } else {
    out.push("bg-white text-slate-700 border-slate-300 hover:border-slate-400")
  }

  return out.join(" ")
}
const select = (v: ListItem): void => {
  emit("update:modelValue", v.value)
}
</script>
