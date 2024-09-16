<script lang="ts" setup>
import type { ListItem, TableTaxonomyConfig } from '@fiction/core'
import type { FictionPosts } from '..'
import EffectDraggableSort from '@fiction/admin/el/EffectDraggableSort.vue'
import { debounce, toLabel, useService, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import InputSelectCustom from '@fiction/ui/inputs/InputSelectCustom.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<TableTaxonomyConfig[]>, default: () => [] },
  taxonomyType: { type: String as vue.PropType<'category' | 'tag'>, default: 'tag' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: TableTaxonomyConfig[]): void
}>()

const service = useService<{ fictionPosts: FictionPosts }>()
const allTaxonomies = vue.ref<TableTaxonomyConfig[]>([])
const list = vue.computed<ListItem[]>(() => allTaxonomies.value.map(t => ({ value: t.taxonomyId, name: t.title, count: t.usageCount, desc: t.description })))
const isFocused = vue.ref(false)
const search = vue.ref<string | undefined>()

const searchCache = new Map<string, TableTaxonomyConfig[]>()
async function fetchList() {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  const orgId = activeOrganizationId

  if (!orgId)
    return []

  const s = search.value || ''

  if (searchCache.has(s))
    return

  const tax = await service.fictionPosts.getPostTaxonomyList({ orgId, type: props.taxonomyType, search: search.value })

  // if not in all taxonomies, add it
  tax.forEach((t) => {
    if (!allTaxonomies.value.find(at => at.taxonomyId === t.taxonomyId))
      allTaxonomies.value.push(t)
  })

  searchCache.set(s, tax)
}

function addTaxonomyFromId(taxonomyId: string) {
  const tax = allTaxonomies.value.find(t => t.taxonomyId === taxonomyId)

  if (!tax)
    return

  emit('update:modelValue', [...props.modelValue, tax])
}

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

vue.watch(() => [search, isFocused.value], () => {
  if (isFocused.value)
    debounce(fetchList, 150)()
  // else
  //   searchText.value = ''
})

const addNewVisible = vue.ref(false)
const addNewTitle = vue.ref('')
function addNew() {
  if (!addNewVisible.value) {
    addNewVisible.value = true
  }
  else if (addNewTitle.value) {
    const newTaxonomy = { title: addNewTitle.value, description: '', taxonomyId: '', type: props.taxonomyType }
    emit('update:modelValue', [...props.modelValue, newTaxonomy])
    addNewVisible.value = false
    addNewTitle.value = ''
  }
}

function removeTaxomomy(tax: TableTaxonomyConfig) {
  emit('update:modelValue', props.modelValue.filter(t => t.taxonomyId !== tax.taxonomyId))
}

async function sortValue(sortedTitles: string[]) {
  await waitFor(20)
  const v = props.modelValue
  const newValue = sortedTitles.map(title => v.find(val => val.title === title)).filter(Boolean) as TableTaxonomyConfig[]
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="space-y-2">
    <EffectDraggableSort class="tag-list flex flex-row flex-wrap gap-1" :allow-horizontal="true" @update:sorted="sortValue($event)">
      <ElBadge v-for="(tax, i) in modelValue" :key="i" :data-drag-id="tax.title" class="gap-1 cursor-grab" :theme="taxonomyType === 'tag' ? 'green' : 'orange'">
        <span>{{ tax.title }}</span>
        <span class="i-tabler-x hover:opacity-70 cursor-pointer" @click="removeTaxomomy(tax)" />
      </ElBadge>
    </EffectDraggableSort>
    <InputSelectCustom
      v-model:search="search"
      v-model:focused="isFocused"
      :allow-search="true"
      :list="renderList"
      @update:model-value="addTaxonomyFromId($event as string)"
    />
    <div class="flex justify-start gap-2">
      <InputText v-if="addNewVisible" v-model="addNewTitle" :placeholder="`${toLabel(taxonomyType)} Name`" />
      <XButton class="shrink-0" :size="!addNewVisible ? 'xs' : 'md'" :btn="addNewVisible ? 'primary' : 'default'" @click.prevent="addNew()">
        Add New
      </XButton>
      <XButton
        v-if="addNewVisible"
        icon="i-tabler-x"
        class="shrink-0"
        size="md"
        btn="default"
        @click.prevent="addNewVisible = false"
      />
    </div>
  </div>
</template>
