<script lang="ts" setup>
import type { Site } from '@fiction/site'
import type { InputOption } from './index.js'
import type { BasicItem } from './InputList.vue'
import { ActionButtonSchema as schema } from '@fiction/core'
import { createOption } from './index.js'
import InputList from './InputList.vue'

defineOptions({ name: 'InputActions' })

const { modelValue = [], site } = defineProps<{ modelValue?: BasicItem[], site?: Site }>()

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
    label: 'Advanced',
    input: 'group',
    isClosed: true,
    icon: { class: 'i-tabler-settings' },
    schema,
    options: [
      createOption({
        key: 'design',
        label: 'Design Style',
        input: 'InputRadioButton',
        props: { uiSize: 'xs' },
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
      item-name="Button"
      :site
      @update:model-value="updateModelValue($event)"
    />
  </div>
</template>
