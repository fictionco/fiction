<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import EffectDraggableSort from '@fiction/admin/el/EffectDraggableSort.vue'
import { toLabel, toSlug, useService, vue, waitFor } from '@fiction/core'
import InputText from '@fiction/ui/inputs/InputText.vue'
import XButton from '../buttons/XButton.vue'

const { modelValue = [], uiSize = 'md', placeholder } = defineProps<{
  modelValue: string[]
  uiSize: StandardSize
  placeholder: string
  table: string
  columnName: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const { fictionDb } = useService()

const addNewVisible = vue.ref(false)
const addNewTitle = vue.ref('')
function addNew() {
  if (addNewTitle.value) {
    const items = modelValue || []

    const allTags = addNewTitle.value.split(',').map(t => toSlug(t.trim())) as string[]

    const newTags = allTags.filter(t => !items.includes(t) && t)

    emit('update:modelValue', [...items, ...newTags])
    addNewVisible.value = false
    addNewTitle.value = ''
  }
}

function removeItem(val: string) {
  const items = modelValue || []
  emit('update:modelValue', items.filter(t => t !== val))
}

async function sortValue(sortedValues: string[]) {
  await waitFor(20)
  const v = modelValue
  const newValue = sortedValues.map(val => v.find(item => item === val)).filter(Boolean) as string[]
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="space-y-3 py-1">
    <EffectDraggableSort v-if="modelValue && modelValue.length" class="tag-list flex flex-row flex-wrap gap-1" :allow-horizontal="true" @update:sorted="sortValue($event)">
      <XButton
        v-for="(item, i) in modelValue"
        :key="i"
        size="sm"
        :data-drag-id="item"
        class="gap-1 cursor-grab"
        theme="default"
        rounding="full"
        :title="item"
      >
        <div class="flex items-center gap-2">
          <span>{{ item }}</span>
          <span class="i-tabler-x opacity-50 hover:opacity-100 cursor-pointer -mr-[2px]" @click.stop="removeItem(item)" />
        </div>
      </XButton>
    </EffectDraggableSort>
    <div class="flex justify-start gap-4">
      <InputText v-model="addNewTitle" :placeholder :ui-size="uiSize" @keyup.enter="addNew()" />
      <div class="flex items-center gap-3">
        <XButton
          icon="i-tabler-plus"
          class="shrink-0"
          :size="uiSize"
          theme="primary"
          rounding="full"
          :disabled="!addNewTitle"
          @click.prevent="addNew()"
        >
          Add
        </XButton>
      </div>
    </div>
  </div>
</template>
