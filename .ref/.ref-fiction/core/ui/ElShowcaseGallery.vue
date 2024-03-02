<script lang="ts" setup>
import { vue } from '@factor/api'
import { RenderImage } from '../plugin-models/model'
import { useFictionApp } from '../util'
import ElImage from './ElImage.vue'

const { fictionModel } = useFictionApp()

const images = vue.shallowRef<RenderImage[]>([])
vue.onMounted(async () => {
  const r = await fictionModel.requests.ListImage.request({
    _action: 'list',
    limit: 200,
    filters: [
      {
        field: 'showcaseStatus',
        value: ['requested', 'ready'],
        operator: 'in',
      },
    ],
  })

  images.value = (r.data || [])
    .map(d => new RenderImage({ fictionModel, ...d }))
    .sort(() => Math.random() - 0.5)
})
function aspectClass(image: RenderImage): string {
  const { width = 0, height = 0 } = image

  if (width > height)
    return 'col-span-6 row-span-2 md:col-span-4'
  else if (width < height)
    return 'col-span-4 row-span-3 md:col-span-3'
  else
    return 'col-span-4 row-span-2 md:col-span-3'
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <ElImage
      v-for="(image, i) in images"
      :key="i"
      :class="aspectClass(image)"
      :image="image"
      mode="display"
    />
  </div>
</template>
