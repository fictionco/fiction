<template>
  <input
    class="f-input f-input-email block w-full appearance-none px-3 py-2 rounded-md border border-bluegray-400 placeholder-bluegray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:text-bluegray-500 disabled:bg-gray-50"
    type="email"
    autocomplete="email"
    placeholder="name@company.com"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts" setup>
defineProps({
  modelValue: { type: [String], default: "" },
})

defineEmits(["update:modelValue"])
</script>
