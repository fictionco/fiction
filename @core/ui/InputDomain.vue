<template>
  <div class="f-input flex">
    <span
      class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-bluegray-400 bg-bluegray-50 text-bluegray-500"
    >
      https://
    </span>

    <input
      v-bind="$attrs"
      type="text"
      class="placeholder-bluegray-300 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-r-md border-bluegray-400"
      placeholder="www.example.com"
      :value="modelValue"
      @input="updateValue($event)"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
})
const emit = defineEmits(["update:modelValue"])

const updateValue = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement

  const v = target.value
    .replace(/^https?:\/\//, "")
    .toLowerCase()
    .replace(" ", "")

  emit("update:modelValue", v)
}
</script>
