<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  modelValue: { type: [Array, String], default: () => [] },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => {} },
  inputClass: { type: String, default: '' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: (string | number)[]): void
}>()
const attrs = vue.useAttrs()
const li = vue.computed(() => {
  return normalizeList(props.list ?? [])
})

const val = vue.computed<(string | number)[]>(() => {
  return typeof props.modelValue === 'string'
    ? props.modelValue.split(',').map(_ => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<(string | number)[]>({
  get: () => {
    return val.value ?? []
  },
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function isSelected(value?: string | number): boolean {
  return !!(value && selected.value?.includes(value))
}

function removeValue(value: string | number): void {
  const index = selected.value.indexOf(value)
  if (index > -1) {
    selected.value.splice(index, 1)
    selected.value = [...selected.value]
  }
}

function selectValue(item: ListItem): void {
  const value = item.value

  if (!value)
    return

  if (selected.value.includes(value))
    removeValue(value)
  else
    selected.value = [...selected.value, value]
}

const classes = [
  'cursor-pointer',
  'mr-[.8em]',
  'h-[1.4em]',
  'w-[1.4em]',
  'appearance-none',
  'rounded-[.25em]',
  'focus:outline-none',
  'focus:ring-0',
  'focus:ring-offset-0',
  'bg-theme-100 focus:bg-theme-200 hover:bg-primary-500 dark:bg-theme-800',
  'active:bg-primary-500 selected:bg-primary-500',
]
function inputClasses(item: ListItem) {
  return vue.computed(() => {
    const sel = isSelected(item.value) ? 'bg-primary-500 dark:bg-primary-700' : ''
    return twMerge(classes, props.inputClass, sel)
  })
}
</script>

<template>
  <div class="my-4">
    <div v-if="li.length === 0" class="text-input-placeholder">
      No Items
    </div>
    <div
      v-for="(item, i) of li"
      v-else
      :key="i"
      class="my-2"
    >
      <label class="inline-flex cursor-pointer items-center">
        <input
          v-bind="attrs"
          type="checkbox"
          :class="inputClasses(item).value"
          :checked="isSelected(item.value)"
          @input="selectValue(item)"
        >
        <span v-if="item.name" class="checkbox-label text-theme-700 dark:text-theme-50 dark:hover:text-theme-0 hover:text-theme-500 font-sans">
          {{ item.name }}
        </span>
      </label>
    </div>
  </div>
</template>
