<template>
  <div class="f-input flex">
    <span
      class="
        inline-flex
        items-center
        px-3
        rounded-l-md
        border border-r-0 border-bluegray-400
        bg-bluegray-50
        text-bluegray-500
      "
    >
      https://
    </span>

    <input
      v-bind="$attrs"
      type="text"
      class="
        placeholder-bluegray-300
        focus:ring-primary-500 focus:border-primary-500
        flex-1
        block
        w-full
        rounded-none rounded-r-md
        border-bluegray-400
      "
      placeholder="www.example.com"
      :value="modelValue"
      @input="updateValue($event.target.value)"
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
  setup(props, { emit }) {
    const updateValue = (v: string): void => {
      v = v
        .replace(/^https?:\/\//, "")
        .toLowerCase()
        .replace(" ", "")

      emit("update:modelValue", v)
    }
    return { updateValue }
  },
}
</script>
