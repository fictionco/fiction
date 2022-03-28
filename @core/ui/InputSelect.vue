<template>
  <select
    :value="modelValue"
    class="f-input block w-full appearance-none overflow-hidden text-ellipsis rounded-md border border-slate-300 px-3 py-2 pr-8 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
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
import { ListItem, normalizeList } from "@factor/api"
import { computed, PropType, useAttrs } from "vue"

const props = defineProps({
  defaultValue: { type: [Number, String, Boolean], default: "" },
  modelValue: { type: [Number, String, Boolean], default: "" },
  list: {
    type: Array as PropType<(ListItem | "divider")[]>,
    default: () => [],
  },
  suffix: { type: String, default: "" },
})

const emit = defineEmits(["update:modelValue"])
const attrs = useAttrs()

if (!props.modelValue && props.defaultValue) {
  emit("update:modelValue", props.defaultValue)
}

const parsedList = computed<ListItem[]>(() => {
  return props.list
    ? normalizeList(props.list, {
        suffix: props.suffix,
      })
    : []
})
</script>
