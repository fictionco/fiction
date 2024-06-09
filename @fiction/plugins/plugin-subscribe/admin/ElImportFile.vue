<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { MediaDisplayObject } from '@fiction/core'
import { log, useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import type { FictionSubscribe } from '..'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const logger = log.contextLogger('ImportFile')

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const uploading = vue.ref(false)
const draggingOver = vue.ref()
const fileList = vue.shallowRef<FileList>()

async function uploadFiles() {
  const files = fileList.value

  uploading.value = true

  const file = files?.[0]

  if (!file)
    return

  try {
    uploading.value = true
    const result = await service.fictionSubscribe.uploadFile({ file })

    if (!result)
      return

    logger.info(`upload result`, { data: result })
  }
  catch (error) {
    logger.error(`upload error`, { error })
  }
  finally {
    uploading.value = false
  }
}

async function handleUploadFile(ev: Event) {
  const target = ev.target as HTMLInputElement
  fileList.value = target.files || undefined
}
async function handleDropFile(ev: Event) {
  const event = ev as DragEvent
  fileList.value = event.dataTransfer?.files || undefined
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
      <div v-if="fileList?.length" class="p-12 space-y-4 text-center rounded-lg border border-dashed border-theme-300 dark:border-theme-600">
        <div class="font-semibold text-lg bg-theme-50 inline-flex items-center gap-2 px-2 rounded-md">
          <div class="i-tabler-file" /><div>{{ fileList?.[0].name }}</div>
        </div>
        <ElActions
          class="justify-center flex gap-4"
          ui-size="md"
          :actions="[{
                       icon: 'i-tabler-arrow-left',
                       name: 'Cancel',
                       onClick: () => { fileList = undefined },
                       btn: 'default',
                     },
                     {
                       name: 'Upload File',
                       icon: 'i-tabler-upload',
                       onClick: () => uploadFiles(),
                       btn: 'primary',
                       loading: uploading,
                     }]"
        />
      </div>
      <label v-else for="file-upload" class="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-theme-300 dark:border-theme-600 hover:border-theme-400 hover:bg-theme-50 px-6 py-10">
        <div class="text-center">
          <div class="text-5xl i-tabler-file-type-csv text-theme-300" />
          <div class="mt-4 flex text-sm leading-6 text-theme-600">
            <div class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
              <span>Upload a file</span>
            </div>
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
