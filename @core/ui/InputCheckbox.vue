<template>
  <label class="f-input inline-flex cursor-pointer">
    <input
      v-bind="attrs"
      type="checkbox"
      class="form-checkbox text-primary-500 rounded-md h-5 w-5 mr-4 appearance-none border border-slate-400"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="checkbox-label">
      <slot />
    </span>
  </label>
</template>
<script lang="ts" setup>
import { useAttrs } from "vue"

defineProps({
  modelValue: { type: Boolean, default: false },
  text: { type: String, default: "" },
})
defineEmits(["update:modelValue"])

const attrs = useAttrs()
</script>
