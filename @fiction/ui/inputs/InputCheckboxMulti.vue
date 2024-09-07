<script lang="ts" setup>
import { normalizeList, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import type { ListItem, StandardSize } from '@fiction/core'
import { getCheckboxClasses } from './theme.js'

const props = defineProps({
  modelValue: { type: [Array, String], default: () => [] },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => {} },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: (string | number)[]): void
}>()

const attrs = vue.useAttrs()
const li = vue.computed(() => normalizeList(props.list ?? []))

const val = vue.computed<(string | number)[]>(() => {
  return typeof props.modelValue === 'string'
    ? props.modelValue.split(',').map(_ => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<(string | number)[]>({
  get: () => val.value ?? [],
  set: v => emit('update:modelValue', v),
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
  else selected.value = [...selected.value, value]
}

const cls = vue.computed(() => getCheckboxClasses(props.uiSize))

function inputClasses(item: ListItem) {
  return vue.computed(() => {
    const sel = isSelected(item.value) ? 'bg-primary-500 dark:bg-primary-700' : ''
    return twMerge(cls.value.input, props.inputClass, sel)
  })
}
</script>

<template>
  <div :class="cls.container">
    <div v-if="li.length === 0" class="text-input-placeholder">
      No Items
    </div>
    <div
      v-for="(item, i) of li"
      v-else
      :key="i"
      :class="cls.item"
    >
      <label :class="cls.label">
        <input
          v-bind="attrs"
          type="checkbox"
          :class="inputClasses(item).value"
          :checked="isSelected(item.value)"
          @input="selectValue(item)"
        >
        <span v-if="item.name" :class="cls.text">
          {{ item.name }}
        </span>
      </label>
    </div>
  </div>
</template>
