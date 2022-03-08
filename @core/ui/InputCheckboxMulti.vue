<template>
  <div class="mt-6">
    <div v-for="(item, i) of li" :key="i" class="my-2">
      <label class="f-input inline-flex cursor-pointer items-center">
        <input
          v-bind="$attrs"
          type="checkbox"
          class="form-checkbox text-primary-500 rounded-md h-5 w-5 mr-4 appearance-none border border-slate-400"
          :checked="isSelected(item.value)"
          @input="selectValue(item)"
        />
        <span
          class="checkbox-label text-sm text-slate-800 hover:text-primary-500"
        >
          {{ item.name }}
        </span>
      </label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { computed, PropType } from "vue"

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  list: { type: Array as PropType<ListItem[]>, default: () => {} },
})
const emit = defineEmits(["update:modelValue"])
const li = computed(() => {
  return normalizeList(props.list ?? ["no items"])
})

const val = computed<string[]>(() => {
  return typeof props.modelValue == "string"
    ? props.modelValue.split(",").map((_) => _.trim())
    : (props.modelValue as string[])
})

const selected = computed<string[]>({
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
</script>
