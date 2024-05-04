<script lang="ts" setup>
import type { MediaDisplayObject } from '@fiction/core'
import { log, shortId, useService, vue } from '@fiction/core'
import ElSpinner from '../ElSpinner.vue'

defineProps({
  modelValue: { type: Object as vue.PropType<MediaDisplayObject>, default: () => {} },
  fileTypes: { type: Array as vue.PropType<string[]>, default: () => ['jpg', 'png', 'gif', 'svg'] },
  fileSize: { type: Number, default: 1000000 },
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
      <span class="font-mono relative flex grow  shadow-sm  group  cursor-pointer space-x-2">
        <span
          class="rounded-md bg-theme-50 dark:bg-theme-700 hover:bg-primary-500 hover:text-primary-0 border border-theme-300 dark:border-theme-500 bg-input-bg-alt hover:border-primary-600 flex justify-center items-center  text-theme-700 dark:text-theme-0 lg:inline-flex select-none space-x-2 text-xs px-4"
        >
          <span v-if="uploading">
            <ElSpinner class="m-auto h-4 w-4" />
          </span>
          <span v-else><span class="inline-block i-tabler-upload" /></span>
          <span>Upload</span>
        </span>
        <input
          :value="modelValue?.url"
          type="text"
          class="grow rounded-md block border border-theme-300 dark:border-theme-500 text-theme-500 dark:text-theme-0 bg-theme-0 dark:bg-theme-950 w-full min-w-0 flex-1   text-xs focus:border-input-border-alt focus:ring-0 "
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
