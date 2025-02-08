<script lang="ts" setup>
import type { InputOption } from './index.js'
import type { BasicItem } from './InputList.vue'
import { ActionButtonSchema as schema } from '@fiction/core'
import { createOption } from './index.js'
import InputList from './InputList.vue'

const { modelValue = [] } = defineProps<{ modelValue?: BasicItem[] }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BasicItem[]): void
}>()

const buttonOptions: InputOption[] = [
  createOption({
    key: 'label',
    label: 'Button Text',
    input: 'InputText',
    props: { placeholder: 'Enter button text' },
    schema,
  }),
  createOption({
    key: 'href',
    label: 'Link',
    input: 'InputSiteRoute',
    schema,
  }),
  createOption({
    key: 'styleGroup',
    label: 'Button Style',
    input: 'group',
    isClosed: true,
    schema,
    options: [
      createOption({
        key: 'design',
        label: 'Design Style',
        input: 'InputRadioButton',
        list: [
          { label: 'Solid', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Link', value: 'link' },
        ],
        schema,
      }),
      createOption({
        key: 'theme',
        label: 'Color Theme',
        input: 'InputColorTheme',
        schema,
      }),
      createOption({
        key: 'size',
        label: 'Size',
        input: 'InputStandardSize',
        schema,
      }),
      createOption({
        key: 'icon',
        label: 'Icon (Left)',
        input: 'InputIcon',
        schema,
      }),
      createOption({
        key: 'iconAfter',
        label: 'Icon (Right)',
        input: 'InputIcon',
        schema,
      }),
      createOption({
        key: 'target',
        label: 'Link Target',
        input: 'InputRadioButton',
        list: [
          { label: 'Same Window', value: '_self' },
          { label: 'New Window', value: '_blank' },
        ],
        schema,
      }),
    ],
  }),

]

function updateModelValue(val: Record<string, unknown>[]) {
  emit('update:modelValue', val)
}

function getItemLabel(args: { item?: BasicItem, index?: number } = {}) {
  const { item, index = 0 } = args
  const name = 'Button'
  return item?.label as string ?? `${name}${index >= 0 ? ` ${index + 1}` : ''}`
}
</script>

<template>
  <div>
    <InputList
      :data-options-num="buttonOptions.length"
      :options="buttonOptions"
      :model-value="modelValue"
      :item-label="(args) => getItemLabel(args)"
      @update:model-value="updateModelValue($event)"
    />
  </div>
</template>
