<script lang="ts" setup>
import type { PostHandlingObject } from '@fiction/posts'
import { PostHandlingSchema as schema } from '@fiction/posts'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputPosts' })

const { modelValue, activePath, editPath } = defineProps<{ modelValue?: PostHandlingObject, activePath?: string, editPath?: string }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: PostHandlingObject): void
  (event: 'update:activePath', payload: string): void
}>()

const globalQueryOptions = [
  createOption({
    schema,
    key: 'limit',
    label: 'Posts Per Page',
    input: 'InputNumber',
    placeholder: '12',
    props: { min: 1, max: 100 },
  }),
  // createOption({
  //   schema,
  //   key: 'query.filters',
  //   label: 'Post Query',
  //   subLabel: 'Show only content that matches these rules',
  //   description: 'Create filter groups to control which content appears. Content will match if it meets ANY of these groups.',
  //   input: 'InputList',
  //   props: {
  //     itemName: 'Match Group',
  //     itemLabel: 'Match Group',
  //   },
  //   options: [
  //     createOption({
  //       schema,
  //       key: 'query.filters.0',
  //       label: 'Filter Rules',
  //       subLabel: 'Content must match ALL of these rules',
  //       description: 'Add multiple rules to narrow down your content. For different combinations, create another filter group above.',
  //       props: {
  //         itemName: 'Rule',
  //         itemLabel: 'Rule',
  //       },
  //       input: 'InputList',
  //       options: [
  //         createOption({
  //           schema,
  //           key: 'query.filters.0.0.field',
  //           label: 'Field',
  //           input: 'InputSelectCustom',
  //           list: [
  //             { label: 'Title', value: 'title' },
  //             { label: 'Content', value: 'content' },
  //             { label: 'Author', value: 'author' },
  //             { label: 'Category', value: 'category' },
  //             { label: 'Tag', value: 'tag' },
  //           ],
  //         }),
  //         createOption({
  //           key: 'query.filters.0.0.operator',
  //           label: 'Operator',
  //           input: 'InputSelectCustom',
  //           list: [
  //             { label: 'Equals', value: '=' },
  //             { label: 'Not Equals', value: '!=' },
  //             { label: 'Contains', value: 'like' },
  //             { label: 'Not Contains', value: 'not like' },
  //             { label: 'In', value: 'in' },
  //             { label: 'Not In', value: 'not in' },
  //           ],
  //         }),
  //         createOption({
  //           key: 'query.filters.0.filters.0.value',
  //           label: 'Value',
  //           input: 'InputText',
  //         }),
  //       ],
  //     }),
  //   ],
  // }),

]
</script>

<template>
  <div class="border-t border-theme-200 dark:border-theme-700 pt-4">
    <FormEngine
      state-key="postHandling"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="globalQueryOptions"
      :active-path="activePath"
      :edit-path="editPath"
      @update:model-value="emit('update:modelValue', $event as PostHandlingObject)"
      @update:active-path="emit('update:activePath', $event)"
    />
  </div>
</template>
