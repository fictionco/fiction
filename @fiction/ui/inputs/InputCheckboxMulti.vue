<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { normList, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import { getCheckboxClasses } from './theme.js'

const { modelValue = [], list = [], inputClass = '', uiSize = 'md' } = defineProps<{
  modelValue?: string | string[]
  list?: NavListItem[]
  inputClass?: string
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: (string | number)[]): void
}>()

const attrs = vue.useAttrs()
const li = vue.computed(() => normList(list ?? []))

const val = vue.computed<(string | number)[]>(() => {
  return typeof modelValue === 'string'
    ? modelValue.split(',').map(_ => _.trim())
    : (modelValue as string[])
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

function selectValue(item: NavListItem): void {
  const value = item.value
  if (!value)
    return
  if (selected.value.includes(value))
    removeValue(value)
  else selected.value = [...selected.value, value]
}

const cls = vue.computed(() => getCheckboxClasses(uiSize))

function inputClasses(item: NavListItem) {
  return vue.computed(() => {
    const sel = isSelected(item.value) ? 'bg-primary-500 dark:bg-primary-700' : ''
    return twMerge(cls.value.input, inputClass, sel)
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
          :disabled="item.isDisabled ? true : undefined"
          @input="selectValue(item)"
        >
        <span v-if="item.label " :class="cls.text">
          {{ item.label }}
          <span v-if="item.count" class="text-theme-400 dark:text-theme-500 font-sans text-[.9em]">
            ({{ item.count }})
          </span>
        </span>

      </label>
    </div>
  </div>
</template>
