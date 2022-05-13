<template>
  <select
    :value="modelValue"
    :class="classes"
    @input="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option disabled value>{{ attrs.placeholder || "Select" }}</option>
    <template v-for="s in parsedList" :key="s.value">
      <option v-if="s.value == 'divider'" disabled>──────────</option>
      <option v-else :value="s.value" :disabled="s.disabled">
        {{ s.label || s.name }}
      </option>
    </template>
  </select>
</template>
<script lang="ts" setup>
import { ListItem, normalizeList, vue } from "@factor/api"
import { textInputClasses } from "./theme"
const props = defineProps({
  defaultValue: { type: [Number, String, Boolean], default: "" },
  modelValue: { type: [Number, String, Boolean], default: "" },
  list: {
    type: Array as vue.PropType<(ListItem | "divider")[]>,
    default: () => [],
  },
  suffix: { type: String, default: "" },
})

const emit = defineEmits(["update:modelValue"])
const attrs = vue.useAttrs()

if (!props.modelValue && props.defaultValue) {
  emit("update:modelValue", props.defaultValue)
}

const parsedList = vue.computed<ListItem[]>(() => {
  return props.list
    ? normalizeList(props.list, {
        suffix: props.suffix,
      })
    : []
})

const classes = ["overflow-hidden", "text-ellipsis", ...textInputClasses()]
</script>
