<script lang="ts" setup>
import type { ActionItem, IndexMeta } from '@factor/api'
import { dayjs, vue } from '@factor/api'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import { useFictionApp } from '../../util'
import type { Model } from '../model'

defineEmits<{
  (event: 'itemClick', payload: Model): void
}>()

const { fictionModel, factorRouter } = useFictionApp()

const models = vue.shallowRef<Model[]>([])
const indexMeta = vue.ref<IndexMeta>()
const loading = vue.ref(true)
const editActions = ['delete']

const actions: ActionItem[] = [
  {
    name: `New Model`,
    href: factorRouter.link('modelIndex', {}, { create: 1 }).value,
    btn: 'primary',
  },
]

async function loadModels() {
  loading.value = true
  const r = await fictionModel.requestIndex({
    table: 'model',
  })
  models.value = r.items || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadModels()
})

const formattedData = vue.computed(() => {
  if (!models.value)
    return []

  const rows = models.value.map((model) => {
    return [
      model.modelId.value,
      model.modelName.value || '[No Name]',
      {
        type: 'slot',
        name: 'images',
        item: model,
      },
      model.templateId.value,
      model.status.value,
      dayjs(model.updatedAt).fromNow(),
    ]
  }) as TableCell[][]

  return [['', 'Name', 'Images', 'Base', 'Status', 'Updated'], ...rows]
})

async function handleRowClick(modelId: string) {
  const link = factorRouter.link('modelTrain', {
    modelId,
  }).value

  await factorRouter.router.push(link)
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
    table: 'model',
  })

  await loadModels()

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
      title: 'No models found',
      description:
        'You haven\'t created a model yet. Just train a new model to get started',
    }"
    :actions="actions"
    :on-row-click="handleRowClick"
    @bulk-edit="handleBulkEdit($event)"
  >
    <template #images="{ item }">
      <div class="p-2">
        <div v-if="item" class="flex shrink-0 -space-x-1">
          <img
            v-for="src in (item as Model).sampleImageUrls.value.slice(0, 3)"
            :key="src"
            :src="src"
            class="bg-theme-0 ring-theme-0 inline-block h-6 w-6 rounded-full ring-2"
          >
        </div>
        <div v-else>
          <div class="i-carbon-model-alt text-theme-500 text-2xl" />
        </div>
      </div>
    </template>
  </ElTable>
</template>
