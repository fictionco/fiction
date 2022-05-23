<template>
  <div>
    <ElButton btn="input" size="sm" @click.stop.prevent="vis = true">
      <div class="i-carbon-image mr-2"></div>
      <span>Add Media</span>
    </ElButton>
    <ElModal v-model:vis="vis" modal-class="max-w-xl">
      <div class="media-gallery grid grid-cols-12 py-2 px-4 text-sm">
        <div class="nav col-span-12">
          <div class="grid grid-cols-2 items-center justify-center text-xs">
            <div
              v-for="(item, i) in navItems"
              :key="i"
              class="border-b-2 py-2 px-3 text-center"
              :class="
                item == navItemActive
                  ? `text-primary-500  border-primary-500 font-semibold`
                  : `text-slate-400 cursor-pointer border-slate-300 hover:text-slate-700`
              "
              @click="navItemActive = item"
            >
              {{ toLabel(item) }}
            </div>
          </div>
        </div>
      </div>
      <div class="media-body p-4" @dragover.prevent @drop.prevent>
        <div
          v-if="navItemActive == 'upload'"
          class="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-200 px-6 pt-8 pb-10 hover:border-slate-300"
          :class="[]"
          @drop="handleDropFile"
          @dragover="draggingOver = true"
          @dragleave="draggingOver = false"
        >
          <div class="space-y-1 text-center">
            <div class="text-center">
              <div class="i-carbon-upload inline-block text-3xl"></div>
            </div>
            <div class="flex text-sm text-slate-500">
              <label
                for="file-upload"
                class="relative cursor-pointer rounded-md bg-white font-medium text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
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
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <div v-else>Library</div>
      </div>
    </ElModal>
  </div>
</template>
<script lang="ts" setup>
import { vue, toLabel, FactorMedia } from "@factor/api"
import ElModal from "./ElModal.vue"
import ElButton from "./ElButton.vue"

defineProps({
  modelValue: { type: [String], default: "" },
  factorMedia: { type: Object as vue.PropType<FactorMedia>, required: true },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()
const draggingOver = vue.ref()
const vis = vue.ref()
const navItems = ["upload", "library"]
const navItemActive = vue.ref(navItems[0])
const uploading = vue.ref(false)

const handleEmit = (target: EventTarget | null): void => {
  const el = target as HTMLInputElement

  emit("update:modelValue", el.value)
}

const uploadFiles = async (files: FileList[]) => {
  const r = 1
}

const handleUploadFile = (ev: Event) => {
  const target = ev.target as HTMLInputElement
  console.log("F", target.files)
}
const handleDropFile = (ev: Event) => {
  const event = ev as DragEvent
  console.log("fil", event.dataTransfer?.files)
}
// const events = ["dragenter", "dragover", "dragleave", "drop"]
// const preventDefaults = (e: Event) => {
//   e.preventDefault()
// }
// vue.onMounted(() => {
//   events.forEach((eventName) => {
//     document.body.addEventListener(eventName, preventDefaults)
//   })
// })

// vue.onUnmounted(() => {
//   events.forEach((eventName) => {
//     document.body.removeEventListener(eventName, preventDefaults)
//   })
// })
</script>
