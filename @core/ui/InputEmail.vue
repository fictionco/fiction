<template>
  <input
    class="block w-full appearance-none focus:outline-none disabled:cursor-not-allowed px-3 py-2 rounded-md border"
    :class="[inputTheme(props.theme)]"
    type="email"
    autocomplete="email"
    placeholder="name@company.com"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts" setup>
import { PropType } from "vue"
import { InputColorTheme, inputTheme } from "."

const props = defineProps({
  modelValue: { type: [String], default: "" },
  theme: { type: String as PropType<InputColorTheme>, default: "standard" },
})

defineEmits(["update:modelValue"])
</script>
