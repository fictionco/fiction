<template>
  <div class="f-input flex">
    <span
      class="
        inline-flex
        items-center
        px-3
        rounded-l-md
        text-bluegray-400
        border border-r-0 border-bluegray-400
        bg-gray-50
        text-sm
      "
    >
      https://
    </span>

    <input
      v-bind="$attrs"
      type="text"
      class="
        placeholder-bluegray-400
        focus:ring-primary-500 focus:border-primary-500
        flex-1
        block
        w-full
        rounded-none rounded-r-md
        border-gray-200
      "
      placeholder="www.example.com"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: "InputUrl",
  props: {
    modelValue: { type: [String, Number], default: "" },
  },
  emits: ["update:modelValue"],
}
</script>
