<template>
  <label class="toggle-wrap flex items-center py-1">
    <input
      class="absolute h-1 w-1 opacity-0"
      v-bind="$attrs"
      type="checkbox"
      :value="val"
      :checked="val"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <button
      type="button"
      aria-pressed="false"
      :class="val == true ? 'bg-primary-500' : 'bg-slate-300'"
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      @click.stop="emit('update:modelValue', !val)"
    >
      <span class="sr-only">{{ val ? "on" : "off" }}</span>

      <span
        aria-hidden="true"
        :class="val == true ? 'translate-x-5' : 'translate-x-0'"
        class="inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
      />
    </button>
    <span
      id="toggleLabel"
      class="ml-4 text-xs font-semibold uppercase tracking-wider"
    >
      <span v-if="val" class="text-primary-500">{{ textOn }}</span>
      <span v-else class="text-slate-500">{{ textOff }}</span>
    </span>
  </label>
</template>
<script lang="ts" setup>
import { computed } from "vue"
const props = defineProps({
  modelValue: { type: [Boolean, String], default: false },
  textOff: { type: String, default: "" },
  textOn: { type: String, default: "" },
})
const emit = defineEmits(["update:modelValue"])
const val = computed<boolean>(() => {
  const mv = props.modelValue
  if (typeof mv == "string") {
    if (mv == "on" || mv == "true") return true
    else return false
  } else return mv
})
</script>
