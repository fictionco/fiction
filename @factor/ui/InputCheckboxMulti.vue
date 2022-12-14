<template>
  <div class="text-input-size my-4">
    <div v-if="li.length == 0" class="text-input-placeholder">No Items</div>
    <div v-for="(item, i) of li" v-else :key="i" class="my-2">
      <label class="inline-flex cursor-pointer items-center">
        <input
          v-bind="attrs"
          type="checkbox"
          :class="classes"
          :checked="isSelected(item.value)"
          @input="selectValue(item)"
        />
        <span class="checkbox-label text-theme-700 select-none">
          {{ item.name }}
        </span>
      </label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { normalizeList, ListItem, vue } from "@factor/api"

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => {} },
})
const attrs = vue.useAttrs()
const emit = defineEmits<{
  (event: "update:modelValue", payload: (string | number)[]): void
}>()

const li = vue.computed(() => {
  return normalizeList(props.list ?? [])
})

const val = vue.computed<(string | number)[]>(() => {
  return typeof props.modelValue == "string"
    ? props.modelValue.split(",").map((_) => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<(string | number)[]>({
  get: () => {
    return val.value ?? []
  },
  set: (v) => {
    emit("update:modelValue", v)
  },
})

const isSelected = (value?: string | number): boolean => {
  return value && selected.value?.includes(value) ? true : false
}

const removeValue = (value: string | number): void => {
  const index = selected.value.indexOf(value)
  if (index > -1) {
    selected.value.splice(index, 1)
    selected.value = [...selected.value]
  }
}

const selectValue = (item: ListItem): void => {
  const value = item.value

  if (!value) return

  if (selected.value.includes(value)) {
    removeValue(value)
  } else {
    selected.value = [...selected.value, value]
  }
}

const classes = [
  "form-checkbox",
  "mr-[.8em]",
  "h-[1.1em]",
  "w-[1.1em]",
  "appearance-none",
  "rounded-[.25em]",
  "border",
  "focus:outline-none",
  "focus:ring-0",
  "border-theme-300",
  "hover:border-theme-400",
  "text-theme-500",
  "bg-theme-100",
]
</script>
