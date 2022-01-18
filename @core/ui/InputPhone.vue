<template>
  <input
    class="f-input block w-full appearance-none px-3 py-2 rounded-md border border-slate-400 placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:text-slate-500 disabled:bg-slate-50"
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
