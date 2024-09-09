<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { MediaObject, TableMediaConfig } from '@fiction/core'
import EffectMasonry from '../effect/EffectMasonry.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import ElImage from '../media/ElImage.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const { fictionMedia } = useService()

const libraryMedia = vue.ref<TableMediaConfig[]>([])
const loadingLibrary = vue.ref(false)

async function fetchLibraryMedia() {
  loadingLibrary.value = true
  try {
    const response = await fictionMedia.requests.ManageMedia.projectRequest({
      _action: 'list',
      limit: 20,
      offset: 0,
    })
    if (response.status === 'success') {
      libraryMedia.value = response.data || []
    }
  }
  catch (error) {
    console.error('Error fetching media library:', error)
  }
  finally {
    loadingLibrary.value = false
  }
}

function selectMedia(media: MediaObject) {
  emit('update:modelValue', { ...props.modelValue, ...media, format: 'url' })
}

function getMasonryItemClass(media: TableMediaConfig) {
  const out = ['w-[18%]']
  if (media.width && media.height) {
    const ratio = media.width / media.height

    // Define standard aspect ratios
    const standardRatios = [
      { class: 'aspect-square', value: 1 },
      { class: 'aspect-video', value: 16 / 9 },
      { class: 'aspect-[4/3]', value: 4 / 3 },
      { class: 'aspect-[3/4]', value: 3 / 4 },
      { class: 'aspect-[3/2]', value: 3 / 2 },
      { class: 'aspect-[2/3]', value: 2 / 3 },
      { class: 'aspect-[5/4]', value: 5 / 4 },
      { class: 'aspect-[4/5]', value: 4 / 5 },
    ]

    // Find the closest standard ratio
    const closestRatio = standardRatios.reduce((prev, curr) =>
      Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev,
    )

    out.push(closestRatio.class)
  }
  else {
    out.push('aspect-square')
  }
  return out.join(' ')
}

vue.onMounted(() => {
  fetchLibraryMedia()
})
</script>

<template>
  <div class="p-8 max-h-[400px] overflow-scroll">
    <div v-if="loadingLibrary" class="flex justify-center py-8">
      <ElSpinner class="text-theme-600 dark:text-theme-500 size-6" />
    </div>
    <EffectMasonry v-else :items="libraryMedia" :options="{ gutter: 10 }">
      <div
        v-for="media in libraryMedia"
        :key="media.mediaId"
        class="masonry-grid-item group relative cursor-pointer overflow-hidden rounded-lg"
        :class="getMasonryItemClass(media)"
        @click="selectMedia(media)"
      >
        <ElImage
          :media="media"
          image-mode="cover"
          class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-theme-900 bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
          <i class="i-tabler-check text-2xl text-theme-100" />
        </div>
      </div>
    </EffectMasonry>
  </div>
</template>
