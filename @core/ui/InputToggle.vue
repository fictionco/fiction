<template>
  <label class="toggle-wrap flex items-center py-1">
    <input
      class="opacity-0 w-1 h-1 absolute"
      v-bind="$attrs"
      type="checkbox"
      :value="val"
      :checked="val"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <button
      type="button"
      aria-pressed="false"
      :class="val == true ? 'bg-primary-500' : 'bg-bluegray-300'"
      class="relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      @click.stop="$emit('update:modelValue', !val)"
    >
      <span class="sr-only">{{ val ? "on" : "off" }}</span>

      <span
        aria-hidden="true"
        :class="val == true ? 'translate-x-5' : 'translate-x-0'"
        class="inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
      />
    </button>
    <span
      id="toggleLabel"
      class="ml-4 uppercase text-xs font-semibold tracking-wider"
    >
      <span v-if="val" class="text-primary-500">{{ textOn }}</span>
      <span v-else class="text-bluegray-500">{{ textOff }}</span>
    </span>
  </label>
</template>
<script lang="ts">
import { computed } from "vue"
export default {
  props: {
    modelValue: { type: [Boolean, String], default: false },
    textOff: { type: String, default: "" },
    textOn: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const val = computed<boolean>(() => {
      const mv = props.modelValue
      if (typeof mv == "string") {
        if (mv == "on" || mv == "true") return true
        else return false
      } else return mv
    })
    return { val }
  },
}
</script>
