<template>
  <span class="relative z-0 inline-flex shadow-sm rounded-md">
    <button
      v-for="(li, i) in list"
      :key="i"
      type="button"
      class="
        relative
        inline-flex
        items-center
        px-4
        py-2
        border
        text-sm
        font-medium
        focus:z-10
        focus:outline-none
        focus:ring-1
        focus:ring-indigo-500
        focus:border-indigo-500
      "
      :class="buttonClass(li, i)"
      @click="select(li)"
    >
      {{ li.name }}
    </button>
  </span>
</template>
<script lang="ts">
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { PropType, computed } from "vue"
export default {
  name: "InputRadioButton",
  props: {
    modelValue: { type: [String, Number], default: "" },
    list: { type: Array as PropType<ListItem[]>, default: () => [] },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
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
        out.push("bg-bluegray-100 text-bluegray-900 border-bluegray-400")
      } else {
        out.push(
          "bg-white text-bluegray-700 border-bluegray-300 hover:border-bluegray-400",
        )
      }

      return out.join(" ")
    }
    const select = (v: ListItem): void => {
      emit("update:modelValue", v.value)
    }
    return { parsedList, buttonClass, select }
  },
}
</script>
