<script lang="ts" setup>
import EffectDraggableSort from '@fiction/admin/el/EffectDraggableSort.vue'
import { toSlug, vue, waitFor } from '@fiction/core'
import InputText from '@fiction/ui/inputs/InputText.vue'
import type { ListItem, StandardSize, TableTaxonomyConfig } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ListItem[]): void
}>()

const addNewVisible = vue.ref(false)
const addNewTitle = vue.ref('')
function addNew() {
  if (!addNewVisible.value) {
    addNewVisible.value = true
  }
  else if (addNewTitle.value) {
    const items = props.modelValue || []
    const newTaxonomy: ListItem = { name: addNewTitle.value, value: toSlug(addNewTitle.value) }
    emit('update:modelValue', [...items, newTaxonomy])
    addNewVisible.value = false
    addNewTitle.value = ''
  }
}

function removeItem(item: ListItem) {
  const items = props.modelValue || []
  emit('update:modelValue', items.filter(t => t.value !== item.value))
}

async function sortValue(sortedValues: string[]) {
  await waitFor(20)
  const v = props.modelValue
  const newValue = sortedValues.map(val => v.find(item => item.value === val)).filter(Boolean) as TableTaxonomyConfig[]
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="space-y-3">
    <EffectDraggableSort v-if="modelValue && modelValue.length" class="tag-list flex flex-row flex-wrap gap-1" :allow-horizontal="true" @update:sorted="sortValue($event)">
      <XButton
        v-for="(item, i) in modelValue"
        :key="i"
        size="sm"
        :data-drag-id="item.value"
        class="gap-1 cursor-grab"
        theme="default"
        rounding="full"
      >
        <div class="flex items-center gap-2">
          <span>{{ item.name }}</span>
          <span class="i-tabler-x opacity-50 hover:opacity-100 cursor-pointer -mr-[2px]" @click="removeItem(item)" />
        </div>
      </XButton>
    </EffectDraggableSort>
    <div class="flex justify-start gap-2">
      <InputText v-if="addNewVisible" v-model="addNewTitle" placeholder="Name" :ui-size="uiSize" />
      <XButton
        icon="i-tabler-plus"
        class="shrink-0"
        size="sm"
        :theme="addNewVisible ? 'primary' : 'default'"
        rounding="full"
        @click.prevent="addNew()"
      >
        Add
      </XButton>
      <XButton
        v-if="addNewVisible"
        icon="i-tabler-x"
        class="shrink-0"
        :size="uiSize"
        theme="default"
        rounding="full"
        @click.prevent="addNewVisible = false"
      />
    </div>
  </div>
</template>
