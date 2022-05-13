<template>
  <div class="">
    <div v-if="li.length == 0" class="text-input-placeholder">No Items</div>
    <div v-for="(item, i) of li" v-else :key="i" class="my-2">
      <label class="f-input inline-flex cursor-pointer items-center">
        <input
          v-bind="attrs"
          type="checkbox"
          :class="classes"
          :checked="isSelected(item.value)"
          @input="selectValue(item)"
        />
        <span
          class="checkbox-label text-input-size text-input-body hover:text-input-primary"
        >
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
  (event: "update:modelValue", payload: string[]): void
}>()

const li = vue.computed(() => {
  return normalizeList(props.list ?? [])
})

const val = vue.computed<string[]>(() => {
  return typeof props.modelValue == "string"
    ? props.modelValue.split(",").map((_) => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<string[]>({
  get: () => {
    return val.value
  },
  set: (v) => {
    emit("update:modelValue", v)
  },
})

const isSelected = (value?: string): boolean => {
  return !!value && selected.value.includes(value)
}

const removeValue = (value: string): void => {
  const index = selected.value.indexOf(value)
  if (index > -1) {
    selected.value.splice(index, 1)
    selected.value = [...selected.value]
  }
}

const selectValue = (item: ListItem): void => {
  const value = item.value

  if (!value) return

  if (!selected.value.includes(value)) {
    selected.value = [...selected.value, value]
  } else {
    removeValue(value)
  }
}

const classes = [
  "form-checkbox",
  "mr-4",
  "h-5",
  "w-5",
  "appearance-none",
  "rounded-md",
  "border",
  "focus:outline-none",
  "focus:ring-0",
  "border-input-edge",
  "text-input-primary",
  "bg-input-base",
  "hover:bg-input-base-alt",
]
</script>
