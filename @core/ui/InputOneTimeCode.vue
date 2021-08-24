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
      f-input-one-time-code
    "
    type="text"
    autocomplete="one-time-code"
    placeholder=""
    size="6"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script lang="ts">
export default {
  name: "InputOneTimeCode",
  props: {
    modelValue: { type: [String], default: "" },
  },
  emits: ["update:modelValue"],
}
</script>
