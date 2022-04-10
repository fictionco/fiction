<template>
  <input
    class="f-input block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
    type="tel"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'tel'"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts" setup>
import { useAttrs } from "vue"
defineEmits(["update:modelValue"])
defineProps({
  modelValue: { type: [String], default: "" },
})

const attrs = useAttrs() as { autocomplete: string; [key: string]: string }
</script>
