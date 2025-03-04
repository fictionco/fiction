<script lang="ts" setup>
import type { NavList } from '@fiction/core'
import type { InputOption, InputProps } from './index.js'
import { NavListSchema as schema } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputNavMenu' })

const { modelValue = [] } = defineProps<{ modelValue?: NavList[] }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: NavList[]): void
}>()

function getInputListProps(name: string) {
  return {
    itemLabel: ({ item, index = 0 } = {}) => item?.title ?? `${name}${index >= 0 ? ` ${index + 1}` : ''}`,
  } as InputProps<'InputList'>
}

const baseOptions: InputOption[] = [
  createOption({
    schema,
    key: 'title',
    label: 'Menu Title',
    input: 'InputText',
    props: {
      placeholder: 'e.g., "Explore", "Connect", "Resources"',
    },
  }),
  createOption({
    schema,
    key: 'items',
    label: 'Navigation Items',
    input: 'InputNav',
  }),
]

/**
 * FormEngine uses an object structure, so create one and work with that
 */
const arrayKey = 'navList'
type PassObject = { [arrayKey]: NavList[] }

const options = [
  createOption({
    key: arrayKey,
    input: 'InputList',
    props: getInputListProps('Menu'),
    options: baseOptions,
  }),
]

function handleUpdate(newValue: PassObject) {
  emit('update:modelValue', newValue[arrayKey])
}
</script>

<template>
  <div>
    <FormEngine
      state-key="navMenuOption"
      :depth="1"
      :model-value="{ [arrayKey]: modelValue }"
      ui-size="md"
      :options="options"
      @update:model-value="handleUpdate($event as PassObject)"
    />
  </div>
</template>
