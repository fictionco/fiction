<template>
  <div class="media-body" @dragover.prevent @drop.prevent>
    <div v-if="uploading" class="p-12">
      <ElSpinner class="text-theme-200 m-auto h-12 w-12" />
    </div>
    <label
      for="file-upload"
      class="border-theme-200 hover:bg-theme-50 hover:border-theme-300 mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed px-4 py-6"
      :class="[]"
      @drop="handleDropFile"
      @dragover="draggingOver = true"
      @dragleave="draggingOver = false"
    >
      <div class="space-y-1 text-center">
        <div class="text-theme-400 text-center">
          <div class="i-carbon-upload inline-block text-2xl"></div>
        </div>
        <div class="text-theme-500 flex text-sm">
          <div
            class="text-theme-700 hover:text-theme-600 relative cursor-pointer rounded-md font-medium"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
              accept="image/*"
              multiple
              @change="handleUploadFile"
            />
          </div>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-theme-500 text-xs">{{ allowedFile }}</p>
      </div>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { vue, FactorMedia } from "@factor/api"
import ElSpinner from "./ElSpinner.vue"

const props = defineProps({
  modelValue: { type: [String], default: "" },

  service: {
    type: Object as vue.PropType<{ factorMedia?: FactorMedia }>,
    default: () => {},
  },
  allowedFile: { type: String, default: "PDF, PNG, JPG, GIF up to 10MB" },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()
const draggingOver = vue.ref()
const uploading = vue.ref(false)

const handleEmit = (val: string = ""): void => {
  emit("update:modelValue", val)
}

const uploadFiles = async (files?: FileList | null) => {
  const factorMedia = props.service.factorMedia
  if (!factorMedia) {
    throw new Error("factorMedia service not added to media uploader")
  }
  if (!files) return
  uploading.value = true
  const result = await factorMedia.uploadFiles({ files })
  if (result[0]?.status == "success") {
    handleEmit(result[0].data?.url)
  }
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
