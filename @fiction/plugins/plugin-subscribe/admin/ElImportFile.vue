<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { MediaDisplayObject } from '@fiction/core'
import { log, useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import type { FictionSubscribe } from '..'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const logger = log.contextLogger('ImportFile')

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const uploading = vue.ref(false)
const draggingOver = vue.ref()

async function uploadFiles(files?: FileList | null) {
  uploading.value = true

  const file = files?.[0]

  if (!file)
    return

  uploading.value = true
  const result = await service.fictionSubscribe.uploadFile({ file })
  log.info('mediaUpload', `upload result`, { data: result })

  if (!result)
    return

  logger.info(`upload result`, { data: result })

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
  <div class="p-16" @dragover.prevent @drop.prevent>
    <ElInput
      label="Upload Subscribers via CSV File"
      ui-size="lg"
      @drop="handleDropFile"
      @dragover="draggingOver = true"
      @dragleave="draggingOver = false"
    >
      <label for="file-upload" class="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-theme-300 hover:border-theme-400 hover:bg-theme-50 px-6 py-10">
        <div class="text-center">
          <div class="text-5xl i-tabler-file-type-csv text-theme-300" />
          <div class="mt-4 flex text-sm leading-6 text-theme-600">
            <label class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
              <span>Upload a file</span>

            </label>
            <p class="pl-1">
              Click to upload or drag and drop
            </p>
          </div>
          <p class="text-xs text-theme-500">
            CSV Files only - 20k Rows Max
          </p>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          class="sr-only"
          accept=".csv,text/csv"
          @change="handleUploadFile"
        >
      </label>
    </ElInput>
  </div>
</template>
