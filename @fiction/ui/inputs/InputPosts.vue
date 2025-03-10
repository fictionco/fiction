<script lang="ts" setup>
import type { PostHandlingObject, PostObject } from '@fiction/core'
import type { InputOption } from './index.js'
import { PostHandlingSchema as schema, shortId, vue } from '@fiction/core'
import { createStockMediaHandler } from '../stock'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputPosts' })

const { modelValue, activePath, editPath } = defineProps<{ modelValue?: PostHandlingObject, activePath?: string, editPath?: string }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: PostHandlingObject): void
  (event: 'update:activePath', payload: string): void
}>()

const baseOptions = [
  createOption({
    schema,
    key: 'format',
    label: 'Post Source',
    input: 'InputRadioButton',
    props: { uiSize: 'sm' },
    list: [
      { label: 'Use Global Posts', value: 'standard', icon: { class: 'i-tabler-files' } },
      { label: 'Set Posts Here', value: 'local', icon: { class: 'i-tabler-file-plus' } },
    ],
  }),
  createOption({
    schema,
    key: 'limit',
    label: 'Posts Per Page',
    input: 'InputNumber',
    props: { min: 1, max: 100 },
  }),
]

const globalQueryOptions = [
  createOption({
    schema,
    key: 'viewSlug',
    label: 'Destination Page',
    subLabel: 'Where should this content appear when clicked?',
    description: 'Leave empty to show content on the current page, or enter a page name like "blog" to show it there instead.',
    input: 'InputText',
    props: {
      placeholder: 'e.g. blog, products, about',
    },

  }),
  createOption({
    schema,
    key: 'query.filters',
    label: 'Content Filters',
    subLabel: 'Show only content that matches these rules',
    description: 'Create filter groups to control which content appears. Content will match if it meets ANY of these groups.',
    input: 'InputList',
    props: {
      itemName: 'Filter Group',
      itemLabel: 'Filter Group',
    },
    options: [
      createOption({
        schema,
        key: 'query.filters.0',
        label: 'Filter Rules',
        subLabel: 'Content must match ALL of these rules',
        description: 'Add multiple rules to narrow down your content. For different combinations, create another filter group above.',
        props: {
          itemName: 'Rule',
          itemLabel: 'Rule',
        },
        input: 'InputList',
        options: [
          createOption({
            schema,
            key: 'query.filters.0.0.field',
            label: 'Field',
            input: 'InputSelectCustom',
            list: [
              { label: 'Title', value: 'title' },
              { label: 'Content', value: 'content' },
              { label: 'Author', value: 'author' },
              { label: 'Category', value: 'category' },
              { label: 'Tag', value: 'tag' },
            ],
          }),
          createOption({
            key: 'query.filters.0.0.operator',
            label: 'Operator',
            input: 'InputSelectCustom',
            list: [
              { label: 'Equals', value: '=' },
              { label: 'Not Equals', value: '!=' },
              { label: 'Contains', value: 'like' },
              { label: 'Not Contains', value: 'not like' },
              { label: 'In', value: 'in' },
              { label: 'Not In', value: 'not in' },
            ],
          }),
          createOption({
            key: 'query.filters.0.filters.0.value',
            label: 'Value',
            input: 'InputText',
          }),
        ],
      }),
    ],
  }),

]

const localPostOptions = [
  createOption({ schema, key: 'entries.0.slug', label: 'Slug', input: 'InputText', getDefaultValue: () => shortId() }),
  createOption({ schema, key: 'entries.0.title', label: 'Title', input: 'InputText', getDefaultValue: () => 'New Post' }),
  createOption({ schema, key: 'entries.0.media', label: 'Media', input: 'InputMedia', getDefaultValue: async () => (await createStockMediaHandler()).getRandomMedia() }),
  createOption({ schema, key: 'entries.0.content', label: 'Content', input: 'InputProse' }),
  createOption({ schema, key: 'entries.0.authors', label: 'Author', input: 'InputAuthors' }),
  createOption({ schema, key: 'entries.0.tags', label: 'Tags', input: 'InputTags' }),
  createOption({ schema, key: 'entries.0.categories', label: 'Categories', input: 'InputTags' }),

]

const options = vue.computed(() => {
  const formatOption = baseOptions.find(opt => opt.key.value === 'format')!
  const limitOption = baseOptions.find(opt => opt.key.value === 'limit')!

  if (modelValue?.format === 'standard') {
    return [
      formatOption,
      ...globalQueryOptions,
      limitOption,
    ]
  }
  else {
    return [
      formatOption,
      limitOption,
      createOption({
        key: 'entries',
        label: 'Local Posts',
        input: 'InputList',
        options: localPostOptions,
        props: {
          itemName: 'Post',
          itemLabel: args => (args?.item as PostObject)?.title ?? 'Untitled',
        },
      }),

    ] as InputOption[]
  }
})
</script>

<template>
  <div class="border-t border-theme-200 dark:border-theme-700 pt-4">
    <FormEngine
      state-key="postHandling"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      :active-path="activePath"
      :edit-path="editPath"
      @update:model-value="emit('update:modelValue', $event as PostHandlingObject)"
      @update:active-path="emit('update:activePath', $event)"
    />
  </div>
</template>
