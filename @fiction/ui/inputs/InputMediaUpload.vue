<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { formatBytes, log, shortId, useService, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import { textInputClasses } from './theme'

const {
  modelValue,
  fileTypes = ['jpg', 'png', 'gif', 'svg', 'webp', 'mp4', 'webm'],
  fileSize = 10_240_000,
  uiSize = 'md',
  hasVideo = false,
} = defineProps<{
  modelValue: MediaObject
  fileTypes?: string[]
  fileSize?: number
  uiSize?: UiElementSize
  hasVideo?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const { fictionMedia, fictionEnv } = useService()

const uploadId = `file-upload-${shortId()}`
const draggingOver = vue.ref(false)
const uploading = vue.ref(false)
const fileInput = vue.ref<HTMLInputElement | null>(null)

const acceptedFileTypes = vue.computed(() => {
  const types = fileTypes.map(type => `image/${type}`)
  if (hasVideo) {
    types.push('video/mp4', 'video/webm')
  }
  return types.join(',')
})

async function updateValue(value: MediaObject): Promise<void> {
  emit('update:modelValue', value)
}

async function uploadFiles(files?: FileList | null) {
  if (!files?.length)
    return

  uploading.value = true
  const file = files[0]

  if (file.size > fileSize) {
    log.warn('mediaUpload', 'File size exceeds limit')
    fictionEnv.events.emit('notify', {
      type: 'error',
      message: `File size exceeds limit of ${formatBytes(fileSize)}`,
    })
    uploading.value = false
    return
  }

  try {
    const result = await fictionMedia.uploadFile({ file })
    log.info('mediaUpload', 'upload result', { data: result })

    if (result?.status === 'success' && result.data) {
      await updateValue(result.data)
    }
  }
  catch (error) {
    log.error('mediaUpload', 'Upload failed', { error })
  }
  finally {
    uploading.value = false
  }
}

function handleUploadFile(ev: Event) {
  const target = ev.target as HTMLInputElement
  uploadFiles(target.files)
}

function handleDropFile(ev: DragEvent) {
  ev.preventDefault()
  draggingOver.value = false
  uploadFiles(ev.dataTransfer?.files)
}

function triggerFileInput() {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="media-body"
    @dragover.prevent="draggingOver = true"
    @dragleave.prevent="draggingOver = false"
    @drop="handleDropFile"
  >
    <label
      :for="uploadId"
      class="relative flex grow shadow-sm group cursor-pointer space-x-2"
      :class="[{ 'border-2 border-dashed border-primary-500': draggingOver }]"
    >
      <XButton
        theme="primary"
        class="shrink-0"
        design="solid"
        icon="i-tabler-upload"
        :loading="uploading"
        @click.prevent="triggerFileInput"
      >
        Upload
      </XButton>
      <input
        :value="modelValue?.url"
        type="text"
        :class="textInputClasses({ inputClass: 'grow', uiSize })"
        @input="updateValue({ url: ($event.target as HTMLInputElement).value })"
      >
      <input
        :id="uploadId"
        ref="fileInput"
        name="file-upload"
        type="file"
        class="sr-only"
        :accept="acceptedFileTypes"
        @change="handleUploadFile"
      >
    </label>
  </div>
</template>
