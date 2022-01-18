<template>
  <input
    class="f-input block w-full appearance-none px-3 py-2 rounded-md border border-slate-400 placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:text-slate-500 disabled:bg-slate-50 f-input-one-time-code"
    type="text"
    autocomplete="one-time-code"
    placeholder=""
    size="6"
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
