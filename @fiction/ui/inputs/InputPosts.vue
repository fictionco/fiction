<script lang="ts" setup>
import type { PostHandlingObject } from '@fiction/core'
import { vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { InputOption } from './index.js'

const { modelValue } = defineProps<{ modelValue?: PostHandlingObject }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: PostHandlingObject): void
}>()

const baseOptions: InputOption[] = [
  new InputOption({
    key: 'format',
    label: 'Post Format',
    input: 'InputSelectCustom',
    list: [
      { name: 'Global Post Query', value: 'global' },
      { name: 'Local (Added Here)', value: 'local' },
    ],
  }),
  new InputOption({
    key: 'limit',
    label: 'Per Page Limit',
    input: 'InputNumber',
    props: { min: 1 },
  }),
]

const filterOptions: InputOption[] = [
  new InputOption({
    key: 'field',
    label: 'Field',
    input: 'InputSelectCustom',
    list: [
      { name: 'Title', value: 'title' },
      { name: 'Content', value: 'content' },
      { name: 'Author', value: 'author' },
      { name: 'Category', value: 'category' },
      { name: 'Tag', value: 'tag' },
    ],
  }),
  new InputOption({
    key: 'operator',
    label: 'Operator',
    input: 'InputSelectCustom',
    list: [
      { name: 'Equals', value: '=' },
      { name: 'Not Equals', value: '!=' },
      { name: 'Contains', value: 'like' },
      { name: 'Not Contains', value: 'not like' },
      { name: 'In', value: 'in' },
      { name: 'Not In', value: 'not in' },
    ],
  }),
  new InputOption({
    key: 'value',
    label: 'Value',
    input: 'InputText',
  }),
]

const globalQueryOptions: InputOption[] = [
  new InputOption({
    key: 'query.filters',
    label: 'Select by Filters',
    subLabel: 'Must match any of these filters (OR logic)',
    description: 'Filters are applied to the global query. If you don\'t want to filter, leave this empty.',
    input: 'InputList',
    props: { itemName: 'Filter' },
    options: [
      new InputOption({
        key: 'filters',
        label: 'Filters',
        subLabel: 'Must match all of these filters (AND logic)',
        description: 'These are applied with OR logic. If using AND logic, add a new top level filter.',
        props: { itemName: 'Filter' },
        input: 'InputList',
        options: filterOptions,
      }),
    ],
  }),
  // new InputOption({
  //   key: 'advanced',
  //   label: 'Advanced Options',
  //   input: 'group',
  //   options: [
  //     new InputOption({
  //       key: 'query.search',
  //       label: 'Search',
  //       input: 'InputText',
  //       props: { placeholder: 'Enter search term' },
  //     }),
  //     new InputOption({
  //       key: 'query.sortBy',
  //       label: 'Sort By',
  //       input: 'InputSelectCustom',
  //       list: [
  //         { name: 'Date', value: 'date' },
  //         { name: 'Title', value: 'title' },
  //         { name: 'Author', value: 'author' },
  //       ],
  //     }),
  //     new InputOption({
  //       key: 'query.sortOrder',
  //       label: 'Sort Order',
  //       input: 'InputSelectCustom',
  //       list: [
  //         { name: 'Ascending', value: 'asc' },
  //         { name: 'Descending', value: 'desc' },
  //       ],
  //     }),
  //   ],
  // }),
]

const localPostOptions: InputOption[] = [
  new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
  new InputOption({ key: 'content', label: 'Content', input: 'InputTextarea' }),
  new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
  new InputOption({ key: 'slug', label: 'Slug', input: 'InputText' }),
  new InputOption({ key: 'tags', label: 'Tags', input: 'InputItems' }),
  new InputOption({ key: 'categories', label: 'Categories', input: 'InputItems' }),
]

const options = vue.computed(() => {
  const formatOption = baseOptions.find(opt => opt.key.value === 'format')!
  const limitOption = baseOptions.find(opt => opt.key.value === 'limit')!

  if (modelValue?.format === 'global') {
    return [
      formatOption,
      ...globalQueryOptions,
      limitOption,
    ]
  }
  else {
    return [
      formatOption,
      new InputOption({
        key: 'posts',
        label: 'Local Posts',
        input: 'InputList',
        options: localPostOptions,
      }),
      limitOption,
    ] as InputOption[]
  }
})
</script>

<template>
  <div class="border-t border-theme-200 dark:border-theme-700 pt-4">
    <FormEngine
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event as PostHandlingObject)"
    />
  </div>
</template>
