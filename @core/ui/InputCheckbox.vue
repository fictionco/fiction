<template>
  <label class="f-input inline-flex cursor-pointer">
    <input
      v-bind="attrs"
      type="checkbox"
      class="form-checkbox mr-4 h-5 w-5 appearance-none rounded-md border border-slate-400 text-primary-500"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="checkbox-label">
      <slot />
    </span>
  </label>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { useAttrs } from "vue"

defineProps({
  modelValue: { type: Boolean, default: false },
  text: { type: String, default: "" },
})
defineEmits(["update:modelValue"])

const attrs = useAttrs()
</script>
