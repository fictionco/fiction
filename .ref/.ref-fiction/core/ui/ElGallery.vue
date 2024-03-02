<script lang="ts" setup>
import { vue } from '@factor/api'
import type { Collection, RenderImage } from '../plugin-models/model'
import ElImage from './ElImage.vue'

import ElLightbox from './ElLightbox.vue'

const props = defineProps({
  collection: {
    type: Object as vue.PropType<Collection>,
    required: true,
  },
})

const allImages = vue.computed(() => {
  if (!props.collection)
    return []

  return props.collection?.mediaFull.value
})
const selectedImage = vue.ref(-1)
function getImageIndex(image: RenderImage) {
  return allImages.value.findIndex(i => i.url === image.url)
}

function aspectClass(image: RenderImage): string {
  const { width = 0, height = 0 } = image

  if (width > height)
    return 'col-span-12 md:col-span-6 row-span-2'
  else if (width < height)
    return 'col-span-12 md:col-span-4 row-span-3'
  else
    return 'col-span-12 md:col-span-4 row-span-2'
}
</script>

<template>
  <div class="collection-grid grid grid-cols-12 gap-4">
    <ElImage
      v-for="(image, i) in collection.mediaFull.value"
      :key="i"
      :image="image"
      :class="aspectClass(image)"
      mode="display"
      @click.stop="selectedImage = getImageIndex(image)"
    />
    <ElLightbox
      v-model:selected="selectedImage"
      :images="allImages"
    />
  </div>
</template>
