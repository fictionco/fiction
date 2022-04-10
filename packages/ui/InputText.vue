<template>
  <input
    class="f-input block w-full appearance-none rounded-md border border-slate-300 bg-slate-50 px-3 py-2 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts" setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
})

defineEmits(["update:modelValue"])
</script>
