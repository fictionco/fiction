<script lang="ts" setup>
import type { ListItem, StandardSize } from '@fiction/core'
import EffectDraggableSort from '@fiction/admin/el/EffectDraggableSort.vue'
import { debounce, log, toSlug, useService, vue, waitFor } from '@fiction/core'
import InputText from '@fiction/ui/inputs/InputText.vue'
import XButton from '../buttons/XButton.vue'

defineOptions({ name: 'InputItems' })

const { modelValue = [], uiSize = 'md', placeholder, table, column } = defineProps<{
  modelValue: string[]
  uiSize: StandardSize
  placeholder?: string
  table?: string
  column?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const logger = log.contextLogger('InputTaxonomy')
const { fictionUser } = useService()
const isFocused = vue.ref(false)
const searchCache = new Map<string, ListItem[]>()
const addNewTitle = vue.ref('')
const currentList = vue.ref<ListItem[]>([])
const list = vue.computed<ListItem[]>(() => currentList.value.map(t => ({ value: t.value, count: t.count })))

async function fetchList() {
  try {
    const activeOrganizationId = fictionUser.activeOrgId.value
    const orgId = activeOrganizationId

    if (!orgId)
      throw new Error('No active organization')

    if (!table || !column)
      return

    const s = addNewTitle.value || ''

    if (searchCache.has(s))
      return

    const r = await fictionUser.requests.GetTopValues.projectRequest({
      table,
      column,
      search: addNewTitle.value,
      arrayColumn: true,
    })

    const vals = r.data || []

    // add missing items
    vals.forEach((t) => {
      if (!currentList.value.find(at => at.value === t.value))
        currentList.value.push(t)
    })

    searchCache.set(s, vals)
  }
  catch (e) {
    logger.error('error fetching taxonomy', { error: e })
  }
}

function addNew(slug?: string) {
  const v = slug || addNewTitle.value

  if (!v) {
    return
  }

  const items = modelValue || []

  const allTags = v.split(',').map(t => toSlug(t.trim())) as string[]

  const newTags = allTags.filter(t => !items.includes(t) && t)

  emit('update:modelValue', [...items, ...newTags])
  addNewTitle.value = ''
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

const search = vue.computed(() => {
  const s = (addNewTitle.value || '').toLowerCase().replace(/\s+/g, '').split(',').pop()
  return s
})

const renderList = vue.computed(() => {
  // Normalize the search text by converting to lower case and removing all whitespace
  const s = search.value?.toLowerCase().replace(/\s+/g, '')
  const li = list.value
  return !s
    ? li
    : li.filter((item) => {
      // Construct a single string from name, description, and value, also normalized
      const searchString = `${item.name?.toLowerCase() || ''} ${item.desc?.toLowerCase() || ''} ${item.value}`
        .replace(/\s+/g, '') // Remove all whitespace for robust matching

      return searchString.includes(s)
    })
})

vue.watch([() => addNewTitle.value, () => isFocused.value], () => {
  if (isFocused.value)
    debounce(fetchList, 150)()
  // else
  //   searchText.value = ''
})
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

    <div class="space-y-2 relative">
      <div class="flex justify-start gap-3">
        <InputText
          v-model="addNewTitle"
          :placeholder="placeholder || 'Item1, Item2'"
          :ui-size="uiSize"
          @keyup.enter.prevent="addNew()"
          @focus="isFocused = true"
        />
        <XButton
          icon="i-tabler-plus"
          class="shrink-0"
          :ui-size="uiSize"
          theme="primary"
          rounding="md"

          @click.prevent="addNew()"
        >
          Add
        </XButton>
      </div>
      <!-- <div v-if="isFocused" class="z-20 p-2 absolute w-full top-[110%] border border-theme-200 dark:border-theme-800 bg-theme-0 dark:bg-theme-600">
        <div v-for="(item, i) in renderList" :key="i">
          {{ item.value }}
        </div>
      </div> -->
    </div>
  </div>
</template>
