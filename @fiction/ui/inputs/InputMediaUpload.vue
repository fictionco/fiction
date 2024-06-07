<script lang="ts" setup>
import type { MediaDisplayObject } from '@fiction/core'
import { log, shortId, useService, vue } from '@fiction/core'
import ElButton from '../ElButton.vue'
import type { UiElementSize } from '../utils'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: Object as vue.PropType<MediaDisplayObject>, default: () => {} },
  fileTypes: { type: Array as vue.PropType<string[]>, default: () => ['jpg', 'png', 'gif', 'svg'] },
  fileSize: { type: Number, default: 1000000 },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaDisplayObject): void
}>()

const { fictionMedia } = useService()

// uploadId is to allow label click without conflict with others on page
const uploadId = `file-upload-${shortId()}`
const draggingOver = vue.ref()
const uploading = vue.ref(false)

async function updateValue(value: MediaDisplayObject): Promise<void> {
  emit('update:modelValue', value)
}

async function uploadFiles(files?: FileList | null) {
  uploading.value = true

  const file = files?.[0]

  if (!file)
    return

  uploading.value = true
  const result = await fictionMedia.uploadFile({ file })
  log.info('mediaUpload', `upload result`, { data: result })

  if (!result)
    return

  if (result.status === 'success' && result.data)
    await updateValue(result.data)

  uploading.value = false
}

async function handleUploadFile(ev: Event) {
  const target = ev.target as HTMLInputElement
  await uploadFiles(target.files)
}
async function handleDropFile(ev: Event) {
  const event = ev as DragEvent
  await uploadFiles(event.dataTransfer?.files)
}

function triggerFileInput() {
  const fileInput = document.getElementById(uploadId) as HTMLInputElement
  fileInput.click()
}
</script>

<template>
  <div
    class="media-body"
    @dragover.prevent
    @drop.prevent
  >
    <label
      :for="uploadId"
      :class="[]"
      @drop="handleDropFile"
      @dragover="draggingOver = true"
      @dragleave="draggingOver = false"
    >
      <span class="font-mono relative flex grow shadow-sm group cursor-pointer space-x-2" @click="console.log('hi')">
        <ElButton class="shrink-0" icon="i-tabler-upload" :loading="uploading" @click="triggerFileInput()">Upload</ElButton>
        <input
          :value="modelValue?.url"
          type="text"
          :class="textInputClasses({ inputClass: 'grow', uiSize })"
          @input="updateValue({ url: ($event.target as HTMLInputElement).value })"
        >
      </span>
      <input
        :id="uploadId"
        name="file-upload"
        type="file"
        class="sr-only"
        accept="image/*"
        multiple
        @change="handleUploadFile"
      >
    </label>
  </div>
</template>
