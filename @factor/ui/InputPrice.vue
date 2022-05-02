<template>
  <div class="relative rounded-md shadow-sm">
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <span class="text-slate-500 sm:text-sm"> $ </span>
    </div>
    <input
      type="number"
      class="block rounded-md border-slate-300 pl-7 pr-12 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      placeholder="0.00"
      :value="modelValue"
      step=".01"
      min="0"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  modelValue: { type: [String], default: "" },
})
defineEmits(["update:modelValue"])
</script>
