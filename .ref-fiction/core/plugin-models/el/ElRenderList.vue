<script lang="ts" setup>
import type { ActionItem, IndexMeta } from '@factor/api'
import { dayjs, vue } from '@factor/api'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import { useFictionApp } from '../../util'
import type { RenderImage } from '../model'
import { Render } from '../model'
import ElLightbox from '../../ui/ElLightbox.vue'

const { fictionModel, factorRouter, factorUser } = useFictionApp()

const renders = vue.shallowRef<Render[]>([])
const indexMeta = vue.ref<IndexMeta>()
const loading = vue.ref(true)
const editActions = ['delete']

const allImages = vue.computed(() => {
  if (!renders.value)
    return []

  return renders.value.flatMap((render) => {
    return render.imagesFull.value
  })
})
const selectedImage = vue.ref(-1)
function getImageIndex(image: RenderImage) {
  return allImages.value.findIndex(i => i.url === image.url)
}
const actions: ActionItem[] = [
  {
    name: `New Model`,
    href: factorRouter.link('modelNew').value,
    btn: 'primary',
  },
]

async function loadRenders() {
  loading.value = true
  await factorUser.userInitialized()

  const r = await fictionModel.requests.QueryRenders.projectRequest({
    limit: 10,
  })

  renders.value = (r.data || []).map((rc) => {
    return new Render({ ...rc, fictionModel })
  })

  loading.value = false
}

vue.onMounted(async () => {
  await loadRenders()
})

const formattedData = vue.computed(() => {
  if (!renders.value)
    return []

  const rows = renders.value.map((render) => {
    return [
      render.modelId,
      render.renderConfig.value.prompt,
      {
        type: 'slot',
        name: 'images',
        item: render,
      },
      dayjs(render.createdAt).fromNow(),
      {
        type: 'link',
        name: 'Create More &rarr;',
        link: factorRouter.link('renderCreate', { modelId: render.modelId }),
      },
    ]
  }) as TableCell[][]

  return [['', 'Prompt', 'Images', 'Created'], ...rows]
})

async function handleBulkEdit(params: {
  _action: string
  selectedIds: string[]
}) {
  const _action = params._action as 'delete'

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

  await loadRenders()
}
</script>

<template>
  <div>
    <ElTable
      :loading="loading"
      :table="formattedData"
      :index-meta="indexMeta"
      :edit-actions="editActions"
      :empty="{
        title: 'No renders yet',
        description:
          'You haven\'t created any renders yet. Select a trained model to get started',
      }"
      :actions="actions"
      @bulk-edit="handleBulkEdit($event)"
    >
      <template #images="{ item }">
        <div class="min-w-[150px] p-2">
          <div v-if="item" class="flex shrink-0 flex-wrap">
            <img
              v-for="img in (item as Render).imagesFull.value"
              :key="img.url"
              :src="img.url"
              class="bg-theme-0 ring-theme-0 mb-2 mr-2 inline-block w-12 cursor-pointer rounded-md ring-2 transition-all hover:scale-105 md:w-16"
              @click.stop="selectedImage = getImageIndex(img)"
            >
          </div>
        </div>
      </template>
    </ElTable>
    <ElLightbox
      v-model:selected="selectedImage"
      :images="allImages"
    />
  </div>
</template>
