<script lang="ts" setup>
import type { MediaObject, TableMediaConfig } from '@fiction/core'
import { removeUndefined, useService, vue } from '@fiction/core'
import XDropDown from '../common/XDropDown.vue'
import EffectMasonry from '../effect/EffectMasonry.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import XMedia from '../media/XMedia.vue'

defineOptions({ name: 'LibraryMedia' })

const { modelValue = {}, cacheKey = '', limit = 20 } = defineProps<{
  modelValue?: MediaObject
  cacheKey?: string
  limit?: number
}>()

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
      limit,
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

async function deleteMediaFromLibrary(mediaId?: string) {
  if (!mediaId)
    return

  const confirmed = confirm('Are you sure you want to delete this media? Any URLs using this media will be broken.')

  if (!confirmed)
    return

  const response = await fictionMedia.requests.ManageMedia.projectRequest({
    _action: 'delete',
    where: [{ mediaId }],
  })
  if (response.status === 'success') {
    await fetchLibraryMedia()
  }
}

function selectMedia(media: MediaObject) {
  const v = { ...modelValue, ...media }
  const newValue = removeUndefined(v, { removeNull: true }) as MediaObject
  emit('update:modelValue', newValue)
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
  vue.watch(
    () => cacheKey,
    () => {
      fetchLibraryMedia()
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class="">
    <div v-if="loadingLibrary" class="flex justify-center py-8">
      <ElSpinner class="text-theme-600 dark:text-theme-500 size-6" />
    </div>
    <div v-else-if="libraryMedia.length === 0" class="p-6 text-center text-sm text-theme-500 dark:text-theme-400">
      No media found
    </div>
    <EffectMasonry v-else :items="libraryMedia" :options="{ gutter: 10 }">
      <div
        v-for="media in libraryMedia"
        :key="media.mediaId"
        class="inline-block masonry-grid-item group relative cursor-pointer  rounded-lg"
        :class="getMasonryItemClass(media)"
        @click="selectMedia(media)"
      >
        <div class="absolute inset-0 overflow-hidden rounded-lg">
          <XMedia
            :media="media"
            image-mode="cover"
            class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div class="absolute inset-0 flex items-center justify-center bg-theme-900 bg-opacity-20 opacity-0 transition-opacity group-hover:opacity-100">
          <i class="i-tabler-upload text-2xl text-theme-100 hover:opacity-100 opacity-70" />
          <XDropDown
            v-slot="{ isActive }"
            dropdown-alignment="center"
            :classes="{ wrapper: 'absolute top-1 right-1', width: 'w-24' }"
            :items="[{ label: 'Delete', onClick: () => deleteMediaFromLibrary(media.mediaId) }]"
            mode="click"
          >
            <div
              class="i-tabler-dots text-theme-100  cursor-pointer leading-[1]"
              :class="isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'"
            />
          </XDropDown>
        </div>
      </div>
    </EffectMasonry>
  </div>
</template>
