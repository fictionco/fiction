<template>
  <input
    class="
      f-input
      block
      w-full
      appearance-none
      px-3
      py-2
      rounded-md
      border border-bluegray-400
      placeholder-bluegray-400
      focus:outline-none focus:ring-primary-500 focus:border-primary-500
      disabled:cursor-not-allowed disabled:text-bluegray-500 disabled:bg-gray-50
    "
    type="tel"
    :value="modelValue"
    placeholder="000-000-0000"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script lang="ts">
export default {
  name: "InputPhone",
  props: {
    modelValue: { type: [String], default: "" },
  },
  emits: ["update:modelValue"],
}
</script>
