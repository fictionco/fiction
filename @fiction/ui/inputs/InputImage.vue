<script lang="ts" setup>
import { log, shortId, useService, vue } from '@fiction/core'
import type { MediaDisplayObject } from '@fiction/core'
import ElButton from '../ElButton.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import InputText from './InputText.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaDisplayObject>, default: () => undefined },
  formats: { type: Object as vue.PropType<{ url?: boolean, html?: boolean }>, default: () => ({ url: true, html: true }) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaDisplayObject): void
}>()

const logger = log.contextLogger('InputImage')

async function updateValue(value: MediaDisplayObject): Promise<void> {
  emit('update:modelValue', { ...props.modelValue, ...value })
}

const v = vue.computed(() => props.modelValue || {})
const uploadId = `file-upload-${shortId()}`
const draggingOver = vue.ref()
const uploading = vue.ref(false)
const layoutMode = vue.ref<'url' | 'upload'>('upload')

const { fictionMedia } = useService()

async function uploadFiles(files?: FileList | null) {
  uploading.value = true
  draggingOver.value = false

  const file = files?.[0]

  if (!file)
    return

  uploading.value = true
  const result = await fictionMedia.uploadFile({ file })
  logger.info(`upload result`, { data: result })

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

const uploadInput = vue.ref< HTMLInputElement>()

async function triggerFileUpload() {
  uploadInput.value?.click() // Programmatically trigger the file input dialog
}
</script>

<template>
  <div>
    <div
      :for="uploadId"
      :class="draggingOver ? 'dark:border-primary-400' : 'dark:border-theme-600'"
      class="flex gap-4 border border-dashed rounded-md p-4 items-center"
      @drop.prevent="handleDropFile"
      @dragover.prevent="draggingOver = true"
      @dragleave="draggingOver = false"
    >
      <div class="overflow-hidden border dark:border-theme-600 flex bg-cover bg-center justify-center items-center shrink-0 w-28 dark:bg-theme-700/70 rounded-md">
        <ElSpinner v-if="uploading" class="my-3 size-5" />
        <div v-else-if="!v?.url" class="my-3 i-tabler-photo-up text-3xl dark:text-theme-600" />
        <img v-else class="max-h-[90px]" :src="v.url">
      </div>
      <div class="space-y-2 grow @container">
        <template v-if="layoutMode === 'url'">
          <InputText
            :model-value="v?.url"
            placeholder="Image URL"
            input-class="text-xs"
            @update:model-value="updateValue({ url: $event })"
          />
          <ElButton icon="i-tabler-arrow-left" size="xs" @click.stop="layoutMode = 'upload'">
            Back to Upload
          </ElButton>
        </template>
        <template v-else>
          <div class="font-sans antialiased text-xs font-semibold dark:text-theme-600 hidden @[5rem]:block">
            Drag &amp; Drop or...
          </div>
          <div class="flex gap-x-2 flex-col @[5rem]:flex-row gap-y-1">
            <ElButton icon="i-tabler-upload" btn="theme" size="xs" @click="triggerFileUpload">
              Upload
            </ElButton>
            <ElButton icon="i-tabler-world" size="xs" @click.stop="layoutMode = 'url'">
              Url
            </ElButton>
            <ElButton v-if="v?.url" icon="i-tabler-x" size="xs" @click="updateValue({ url: $event })" />
          </div>
        </template>
      </div>
      <input
        :id="uploadId"
        ref="uploadInput"
        name="file-upload"
        type="file"
        class="sr-only"
        accept="image/*"
        multiple
        @change="handleUploadFile"
      >
    </div>
  </div>
</template>
