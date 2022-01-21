<template>
  <div class="relative rounded-md shadow-sm">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <span class="text-slate-500 sm:text-sm"> $ </span>
    </div>
    <input
      type="number"
      class="focus:ring-primary-500 focus:border-primary-500 block pl-7 pr-12 sm:text-sm border-slate-400 rounded-md"
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
