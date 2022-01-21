<template>
  <div class="f-input flex">
    <span
      class="inline-flex items-center px-3 rounded-l-md text-slate-400 border border-r-0 border-slate-400 bg-slate-50 text-sm"
    >
      https://
    </span>

    <input
      v-bind="attrs"
      type="text"
      class="placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-r-md border-slate-400"
      placeholder="www.example.com"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
<script lang="ts" setup>
import { useAttrs } from "vue"
defineProps({
  modelValue: { type: [String, Number], default: "" },
})

const attrs = useAttrs()

const emit = defineEmits(["update:modelValue"])
</script>
