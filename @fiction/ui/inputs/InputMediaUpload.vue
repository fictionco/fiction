<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { formatBytes, log, shortId, useService, vue } from '@fiction/core'
import { resizeImage } from '@fiction/core/plugin-media/browserResize'
import XButton from '../buttons/XButton.vue'
import { textInputClasses } from './theme'

defineOptions({ name: 'InputMediaUpload' })

const {
  modelValue,
  fileTypes = ['jpg', 'png', 'gif', 'svg', 'webp', 'mp4', 'webm'],
  fileSize = 10_240_000,
  uiSize = 'md',
  hasVideo = true,
  inputClass = '',
  maxWidth = 3840,
  maxHeight = 2160,
} = defineProps<{
  modelValue: MediaObject
  fileTypes?: string[]
  fileSize?: number
  uiSize?: UiElementSize
  hasVideo?: boolean
  inputClass?: string
  maxWidth?: number
  maxHeight?: number
  preserveFormat?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
  (event: 'uploadProgress', payload: number): void
}>()

const { fictionMedia, fictionEnv } = useService()

const uploadId = `file-upload-${shortId()}`
const draggingOver = vue.ref(false)
const uploading = vue.ref(false)
const fileInput = vue.ref<HTMLInputElement | null>(null)
const uploadProgress = vue.ref(0)

const acceptedFileTypes = vue.computed(() => [
  'image/*',
  ...(hasVideo ? ['video/mp4', 'video/webm', 'video/quicktime'] : []),
].join(','))

async function updateValue(value: MediaObject): Promise<void> {
  emit('update:modelValue', value)
}

async function processFile(file: File) {
  try {
    // Resize image if needed
    const processedFile = await resizeImage(file, {
      maxWidth,
      maxHeight,
      maxFileSize: fileSize,
      onProgress: (progress) => {
        uploadProgress.value = progress * 0.5 // First 50% is resize
        emit('uploadProgress', uploadProgress.value)
      },
    })

    return processedFile
  }
  catch (error) {
    if (error instanceof Error) {
      log.warn('mediaUpload', 'Image processing failed', { error })
      fictionEnv.events.emit('notify', {
        type: 'error',
        message: `Image processing failed: ${error.message}`,
      })
    }
    throw error
  }
}

async function uploadFiles(files?: FileList | null) {
  if (!files?.length)
    return

  uploading.value = true
  uploadProgress.value = 0
  const file = files[0]

  try {
    // Process file (resize if needed)
    const processedFile = await processFile(file)

    // Check final size
    if (processedFile.size > fileSize) {
      throw new Error(`File size over limit: ${formatBytes(fileSize)}`)
    }

    // Upload to server
    const result = await fictionMedia.uploadFile({
      file: processedFile,
      caller: 'InputMediaUpload',
    })

    if (result?.status === 'success' && result.data) {
      await updateValue(result.data)
      uploadProgress.value = 1
      emit('uploadProgress', 1)
    }
  }
  catch (error) {
    log.error('mediaUpload', 'Upload failed', { error })
    fictionEnv.events.emit('notify', {
      type: 'error',
      message: error instanceof Error ? error.message : 'Upload failed',
    })
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
      :class="[{ 'border-2 border-dashed border-primary-500': draggingOver }, inputClass]"
    >
      <XButton
        theme="primary"
        class="shrink-0"
        design="solid"
        rounding="md"
        icon-after="i-tabler-upload"
        :loading="uploading"
        @click.prevent="triggerFileInput"
      >Upload</XButton>
      <input
        :value="modelValue?.url"
        type="text"
        :class="textInputClasses({ inputClass: 'grow', uiSize })"
        placeholder="Enter URL or upload image/video"
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
