<script lang="ts" setup>
import type { ActionItem, IndexMeta } from '@factor/api'
import { dayjs, vue } from '@factor/api'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import { useFictionApp } from '../util'
import type { Collection } from '../plugin-models/model'

defineEmits<{
  (event: 'itemClick', payload: Collection): void
}>()

const { fictionModel, factorRouter } = useFictionApp()

const collections = vue.shallowRef<Collection[]>([])
const indexMeta = vue.ref<IndexMeta>()
const loading = vue.ref(true)
const editActions = ['delete']

const actions: ActionItem[] = [
  {
    name: `New Collection`,
    href: factorRouter.link('collectionEdit', { collectionId: '' }).value,
    btn: 'primary',
  },
]

async function loadCollections() {
  loading.value = true
  const r = await fictionModel.requestIndex({ table: 'collection' })
  collections.value = r.items || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadCollections()
})

const formattedData = vue.computed(() => {
  if (!collections.value)
    return []

  const rows = collections.value.map((collection) => {
    return [
      collection.collectionId,
      collection.title.value || 'Untitled',
      collection.description.value || 'No description',
      dayjs(collection.updatedAt).fromNow(),
    ]
  }) as TableCell[][]

  return [['', 'Title', 'Description', 'Updated'], ...rows]
})

async function handleRowClick(collectionId: string) {
  await factorRouter.goto('collectionEdit', { collectionId })
}

async function handleBulkEdit(params: {
  _action: string
  selectedIds: string[]
}) {
  const _action = params._action as 'delete'

  loading.value = true

  if (_action === 'delete') {
    const confirmed = confirm('Are you sure you want to delete this?')
    if (!confirmed)
      return
  }

  await fictionModel.bulkEdit({
    _action,
    selectedIds: params.selectedIds,
    table: 'collection',
  })

  await loadCollections()

  loading.value = false
}
</script>

<template>
  <ElTable
    :loading="loading"
    :table="formattedData"
    :index-meta="indexMeta"
    :edit-actions="editActions"
    :empty="{
      title: 'No Collections found',
      description:
        'Collections are a way to organize and share your media. Create one.',
    }"
    :actions="actions"
    :on-row-click="handleRowClick"
    @bulk-edit="handleBulkEdit($event)"
  />
</template>
