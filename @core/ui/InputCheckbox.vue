<template>
  <label class="f-input inline-flex cursor-pointer">
    <input
      v-bind="$attrs"
      type="checkbox"
      class="
        form-checkbox
        text-primary-500
        rounded-md
        h-5
        w-5
        mt-1
        mr-4
        appearance-none
        border border-bluegray-400
      "
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkbox-label">
      <slot />
    </span>
  </label>
</template>
<script lang="ts">
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    text: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
}
</script>
