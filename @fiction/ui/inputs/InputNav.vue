<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Site } from '@fiction/site/site.js'
import type { InputOption, InputProps } from './index.js'
import { NavListItemSchema as schema } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputNav' })

const {
  modelValue,
  hasChildNav = false,
  site,
} = defineProps<{
  modelValue?: NavListItem[]
  hasChildNav?: boolean
  site?: Site
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: NavListItem[]): void
}>()

function getInputListProps(name: string) {
  return {
    itemLabel: ({ item, index = 0 } = {}) => item?.label ?? `${name}${index >= 0 ? ` ${index + 1}` : ''}`,
    site,
  } as InputProps<'InputList'>
}

const baseOptions: InputOption[] = [
  createOption({ schema, key: 'label', label: 'Label', input: 'InputText', isRequired: true }),
  createOption({ schema, key: 'href', label: 'Link', input: 'InputSiteRoute' }),
  createOption({ schema, key: 'icon', label: 'Icon', input: 'InputIcon' }),
  // createOption({
  //   schema,
  //   key: 'advancedNavItems',
  //   label: 'Advanced Settings',
  //   input: 'group',
  //   isClosed: true,
  //   options: [
  //     createOption({ schema, key: 'description', label: 'Description', input: 'InputText', description: 'Shown in expanded menus' }),
  //     createOption({ schema, key: 'variant', label: 'Style Variant', input: 'InputSelect', list: ['default', 'button', 'avatar'] }),
  //     createOption({ schema, key: 'emphasis', label: 'Emphasis', input: 'InputSelect', list: ['default', 'highlighted', 'muted'] }),
  //     createOption({ schema, key: 'theme', label: 'Color Theme', description: 'Used in buttons and emphasis', input: 'InputColorScheme' }),
  //   ],
  // }),

]

const childMenuOptions = [
  createOption({
    key: 'list',
    label: 'Child Menu',
    input: 'group',
    options: [

      createOption({
        schema,
        key: 'list.items',
        label: 'Nav Items',
        input: 'InputList',
        props: getInputListProps('Child Nav Item'),
        options: [
          createOption({ schema, key: 'list.items.0.label', label: 'Label', input: 'InputText' }),
          createOption({ schema, key: 'description', label: 'Description', input: 'InputText' }),
          createOption({ schema, key: 'href', label: 'Link', input: 'InputUrl' }),
          createOption({ schema, key: 'icon', label: 'Icon', input: 'InputIcon' }),
        ],
      }),
      createOption({ schema, key: 'list.title', input: 'title', label: 'Menu Settings' }),
      createOption({
        schema,
        key: 'list.variant',
        label: 'Sub Menu Style',
        subLabel: 'How the child menu is displayed',
        input: 'InputSelect',
        list: [
          { value: 'default', label: 'Standard' },
          { value: 'expanded', label: 'Large / Mega' },
        ],
      }),
      createOption({
        schema,
        key: 'list.title',
        label: 'Menu Title',
        subLabel: 'Optional title for the child menu',
        description: 'The title is shown in expanded menus',
        input: 'InputText',
      }),

    ],
  }),
]

/**
 * FormEngine uses an object structure, so create one and work with that
 */
const arrayKey = 'navListItems'
type PassObject = { [arrayKey]: NavListItem[] }

const options = [
  createOption({
    key: arrayKey,
    input: 'InputList',
    props: getInputListProps('Nav Item'),
    options: [
      ...baseOptions,
      ...(hasChildNav ? childMenuOptions : []),
    ],
  }),
]

function handleUpdate(newValue: PassObject) {
  emit('update:modelValue', newValue[arrayKey])
}
</script>

<template>
  <div>
    <FormEngine
      state-key="navOption"
      :depth="1"
      :model-value="{ [arrayKey]: modelValue }"
      :input-props="{ site }"
      ui-size="md"
      :options="options"
      @update:model-value="handleUpdate($event as PassObject)"
    />
  </div>
</template>
