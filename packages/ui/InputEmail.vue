<template>
  <input
    class="block w-full appearance-none rounded-md border px-3 py-2 focus:outline-none disabled:cursor-not-allowed"
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
import { InputColorTheme, inputTheme } from "./theme"

const props = defineProps({
  modelValue: { type: [String], default: "" },
  theme: { type: String as PropType<InputColorTheme>, default: "standard" },
})

defineEmits(["update:modelValue"])
</script>
