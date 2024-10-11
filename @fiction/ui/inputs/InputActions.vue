<script lang="ts" setup>
import type { BasicItem } from './InputList.vue'
import { colorThemeUser, vue } from '@fiction/core'
import { InputOption } from './index.js'
import InputList from './InputList.vue'

type OptionKey = 'name' | 'href' | 'design' | 'theme' | 'size' | 'icon' | 'iconAfter' | 'target'

const { modelValue = [], disableKeys = [], addOptions = [] } = defineProps<{ modelValue?: BasicItem[], disableKeys?: OptionKey[], addOptions?: InputOption<any>[] }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BasicItem[]): void
}>()

const buttonOptions: InputOption[] = [
  new InputOption({
    key: 'name',
    label: 'Button Text',
    input: 'InputText',
    props: { placeholder: 'Enter button text' },
  }),
  new InputOption({
    key: 'href',
    label: 'Link',
    input: 'InputUrl',
    props: { placeholder: 'Enter URL or path' },
  }),
  new InputOption({
    key: 'design',
    label: 'Design Style',
    input: 'InputSelectCustom',
    list: [
      { name: 'Solid', value: 'solid' },
      { name: 'Outline', value: 'outline' },
      { name: 'Ghost', value: 'ghost' },
      { name: 'Link', value: 'link' },
    ],
  }),
  new InputOption({
    key: 'theme',
    label: 'Color Theme',
    input: 'InputSelectCustom',
    list: colorThemeUser,
  }),
  new InputOption({
    key: 'size',
    label: 'Size',
    input: 'InputSelectCustom',
    list: [
      { name: 'Extra Small', value: 'xs' },
      { name: 'Small', value: 'sm' },
      { name: 'Medium', value: 'md' },
      { name: 'Large', value: 'lg' },
      { name: 'Extra Large', value: 'xl' },
    ],
  }),
  new InputOption({
    key: 'icon',
    label: 'Icon (Left)',
    input: 'InputIcon',
  }),
  new InputOption({
    key: 'iconAfter',
    label: 'Icon (Right)',
    input: 'InputIcon',
  }),
  new InputOption({
    key: 'target',
    label: 'Link Target',
    input: 'InputSelectCustom',
    list: [
      { name: 'Same Window', value: '_self' },
      { name: 'New Window', value: '_blank' },
    ],
  }),

]

const finalOptions = [...buttonOptions.filter(_ => !disableKeys.includes(_.key.value as OptionKey)), ...addOptions]

function updateModelValue(val: Record<string, unknown>[]) {
  emit('update:modelValue', val)
}
</script>

<template>
  <div>
    <InputList
      :data-options-num="buttonOptions.length"
      item-name="Button"
      :options="finalOptions"
      :model-value="modelValue"
      @update:model-value="updateModelValue($event)"
    />
  </div>
</template>
