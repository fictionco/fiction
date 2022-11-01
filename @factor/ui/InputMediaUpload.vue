<template>
  <div class="media-body" @dragover.prevent @drop.prevent>
    <div v-if="uploading" class="p-12">
      <ElSpinner class="text-theme-200 m-auto h-12 w-12" />
    </div>
    <label
      v-else
      :for="uploadId"
      class="border-theme-300 hover:bg-theme-50 hover:border-theme-400 mt-1 flex cursor-pointer justify-center rounded-md border border-dashed px-4 py-6"
      :class="[]"
      @drop="handleDropFile"
      @dragover="draggingOver = true"
      @dragleave="draggingOver = false"
    >
      <div class="space-y-1 text-center">
        <div class="text-theme-500 text-xs flex space-x-1 items-center">
          <div class="i-carbon-image text-theme-400 inline-block text-lg"></div>
          <div class="uppercase tracking-wide font-medium">Upload Image</div>
        </div>
        <input
          :id="uploadId"
          name="file-upload"
          type="file"
          class="sr-only"
          accept="image/*"
          multiple
          @change="handleUploadFile"
        />
      </div>
    </label>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import { vue, FactorMedia, log, objectId } from "@factor/api"
import { MediaDisplayObject } from "./utils"
import ElSpinner from "./ElSpinner.vue"
// uploadId is to allow label click without conflict with others on page
const uploadId = `file-upload-${objectId()}`
const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<MediaDisplayObject[]>,
    default: () => [],
  },
  service: {
    type: Object as vue.PropType<{ factorMedia?: FactorMedia }>,
    default: () => {},
  },
  allowedFile: { type: String, default: "PDF, PNG, JPG, GIF up to 10MB" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: MediaDisplayObject[]): void
}>()
const draggingOver = vue.ref()
const uploading = vue.ref(false)

const updateValue = async (value: MediaDisplayObject[]): Promise<void> => {
  emit("update:modelValue", value)
}

const uploadFiles = async (files?: FileList | null) => {
  const factorMedia = props.service.factorMedia
  if (!factorMedia) {
    throw new Error("factorMedia service not added to media uploader")
  }
  if (!files) {
    log.info("mediaUpload", "No files to upload")
    return
  } else {
    log.info("mediaUpload", `uploading ${files.length} files`)
  }
  uploading.value = true
  const result = await factorMedia.uploadFiles({ files })
  log.info("mediaUpload", `upload result`, { data: result })

  const urls = result
    .filter((_) => _ && _.status == "success" && _.data)
    .map((r) => r?.data) as MediaDisplayObject[]

  await updateValue(urls)
  uploading.value = false
}

const handleUploadFile = async (ev: Event) => {
  const target = ev.target as HTMLInputElement
  await uploadFiles(target.files)
}
const handleDropFile = async (ev: Event) => {
  const event = ev as DragEvent
  await uploadFiles(event.dataTransfer?.files)
}
</script>
