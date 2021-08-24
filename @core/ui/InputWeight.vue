<template>
  <span class="relative z-0 inline-flex shadow-sm rounded-md">
    <button
      v-for="(r, i) in range"
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
        focus:ring-primary-500
        focus:border-primary-500
      "
      :class="buttonClass(r, i)"
      @click="select(r)"
    >
      {{ r }}
    </button>
  </span>
</template>
<script lang="ts">
import { computed } from "vue"
export default {
  name: "InputText",
  props: {
    min: { type: String, default: "1" },
    max: { type: String, default: "10" },
    modelValue: { type: [String, Number], default: "" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
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
        out.push("bg-white border-gray-300 hover:bg-gray-50")
      }

      return out.join(" ")
    }
    const select = (v: number): void => {
      emit("update:modelValue", v)
    }
    return { range, buttonClass, select }
  },
}
</script>
