<script lang="ts" setup>
import InputCustomSelect from '@factor/ui/InputSelectCustom.vue'
import type { DataFilter, ProgressStatus } from '@factor/api'
import { vue } from '@factor/api'

import { useFictionApp } from '../../util'
import type { Model } from '../model'
import { baseModels } from '../model'

const props = defineProps({
  status: {
    type: String as vue.PropType<ProgressStatus>,
    required: true,
  },
})

const { fictionModel, factorUser } = useFictionApp()

const models = vue.shallowRef<Model[]>([])
const loading = vue.ref(true)
vue.onMounted(async () => {
  vue.watch(
    () => factorUser.activeOrganizationId.value,
    async (val) => {
      if (val) {
        const filters: DataFilter[] = []

        if (props.status)
          filters.push({ field: 'status', operator: '=', value: props.status })

        const r = await fictionModel.requestIndex({
          table: 'model',
          filters,
        })

        models.value = [...(r.items || []), ...baseModels(fictionModel)]
        loading.value = false
      }
    },
    { immediate: true },
  )
})

const list = vue.computed(() => {
  const m = props.status
    ? models.value.filter(m => m.status.value === props.status)
    : models.value
  return m.map((model) => {
    const images = model.sampleImageUrls.value
    const modelId = model.modelId.value
    return {
      name: model.modelName.value,
      value: modelId,
      desc: modelId?.includes('base') ? 'Base Model' : 'Custom Model',
      images,
    }
  })
})
</script>

<template>
  <InputCustomSelect
    :list="list"
    default-text="Select Model"
    :zero-text="`No models have status: ${status}`"
  >
    <template #avatar="{ item }">
      <div v-if="item" class="flex shrink-0 -space-x-2">
        <img
          v-for="src in (item.images as string[]).slice(0, 3)"
          :key="src"
          :src="src"
          class="bg-theme-0 ring-theme-0 inline-block h-6 w-6 rounded-full ring-2"
        >
      </div>
    </template>
  </InputCustomSelect>
</template>
