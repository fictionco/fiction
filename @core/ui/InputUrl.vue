<template>
  <div class="f-input flex">
    <span
      class="inline-flex items-center rounded-l-md border border-r-0 border-slate-400 bg-slate-50 px-3 text-sm text-slate-400"
    >
      https://
    </span>

    <input
      v-bind="attrs"
      type="text"
      class="block w-full flex-1 rounded-none rounded-r-md border-slate-400 placeholder:text-slate-400 focus:border-primary-500 focus:ring-primary-500"
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
