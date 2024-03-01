<script lang="ts" setup>
// @unocss-include
import { log, objectId, vue } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import type { ImageFile, MultiImageHandler } from './handler'

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<ImageFile[]>,
    default: () => [],
  },
  handler: {
    type: Object as vue.PropType<MultiImageHandler>,
    default: () => {},
  },
  allowedFile: { type: String, default: 'PDF, PNG, JPG, GIF up to 10MB' },
  loading: { type: Boolean, default: false },
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: 30,
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: ImageFile[]): void
}>()
// uploadId is to allow label click without conflict with others on page
const uploadId = `file-upload-${objectId()}`
const attrs = vue.useAttrs()
const validEl = vue.ref<HTMLInputElement>()
const isValid = vue.ref({})
const maximum = vue.computed(() =>
  props.min && props.max < props.min ? props.min : props.max,
)
const draggingOver = vue.ref()
const adding = vue.ref(false)

function updateValue(value: ImageFile[]) {
  emit('update:modelValue', value)
}

const files = vue.computed<ImageFile[]>(() => {
  return props.handler.files.value || []
})

async function addFiles(files?: FileList | null) {
  adding.value = true

  if (files) {
    log.info('mediaUpload', `adding ${files.length} files`)
  }
  else {
    log.info('mediaUpload', 'No files to upload')
    return
  }

  await props.handler.addFiles(files)

  updateValue(props.handler.files.value)

  adding.value = false
}

async function handleClickFile(ev: Event) {
  const target = ev.target as HTMLInputElement
  await addFiles(target.files)
}
async function handleDropFile(ev: Event) {
  const event = ev as DragEvent
  await addFiles(event.dataTransfer?.files)
}

vue.onMounted(() => {
  setTimeout(() => {
    updateValue(props.handler.files.value || [])
  }, 1000)

  vue.watch(
    () => props.modelValue,
    (val) => {
      const isRequired = attrs.required !== undefined
      const min = props.min ?? (isRequired ? 1 : 0)
      const count = val ? val.length : 0

      if (min && count < min) {
        validEl.value?.setCustomValidity(`please include minimum ${min} images`)
        isValid.value = { min, val, valid: false, isRequired }
      }
      else {
        validEl.value?.setCustomValidity('')
        isValid.value = { min, val, valid: true, isRequired }
      }
    },
    { immediate: true },
  )
})

// vue.onMounted(async () => {
//   vue.watch(
//     () => props.zip,
//     async (val) => {
//       if (val) {
//         loading.value = true
//         if (props.zip) {
//           await props.handler.addFilesFromZipUrl(props.zip)
//         }
//         loading.value = false
//       }
//     },
//     { immediate: true },
//   )
// })
</script>

<template>
  <div>
    <div v-if="files && files.length > 0" class="mb-6">
      <div
        class="filelist mt-4 mb-8 grid grid-cols-12 gap-3 sm:gap-4"
        :class="loading ? 'opacity-50' : ''"
      >
        <div
          v-for="(fileItem, i) in files"
          :key="i"
          class="group relative self-center"
          :class="
            fileItem.aspectMode === 'portrait' ? 'col-span-3' : 'col-span-4'
          "
          @mousedown="fileItem.handleMouseDown($event)"
          @mousemove="fileItem.handleMouseMove($event)"
        >
          <div
            class="absolute right-2 top-2 z-20 hidden cursor-pointer rounded-full bg-black/30 p-1 text-xs text-white hover:bg-black/50 group-hover:block"
            @click="handler.removeFiles([fileItem])"
          >
            <div class="i-carbon-close" />
          </div>
          <canvas
            class="image-mask absolute z-10 cursor-move opacity-70"
            :class="`mask-${fileItem.mediaId}`"
          />
          <img
            class="rounded-md"
            :class="`image-${fileItem.mediaId}`"
            :src="fileItem.url"
            :width="fileItem.width"
            :height="fileItem.height"
          >
        </div>
      </div>
    </div>
    <div
      class="media-body"
      @dragover.prevent
      @drop.prevent
    >
      <label
        :for="uploadId"
        class="bg-theme-50 border-theme-300 hover:bg-theme-100 text-theme-200 hover:text-theme-300 hover:border-theme-400 border-1 mt-1 flex aspect-[3/1] cursor-pointer justify-center rounded-md border px-4 py-6 transition-all hover:shadow-md"
        :class="[]"
        @drop="handleDropFile"
        @dragover="draggingOver = true"
        @dragleave="draggingOver = false"
      >
        <div class="flex flex-col justify-center space-y-1 text-center">
          <div
            v-if="loading || adding"
            class="flex items-center space-x-4 py-4"
          >
            <ElSpinner class="h-6 w-6" />
            <div class="text-xs font-semibold uppercase tracking-wider">
              Loading
            </div>
          </div>
          <div
            v-else
            class="flex select-none items-center space-x-1 rounded-lg p-2 text-4xl"
          >
            <div class="font-extrabold tracking-tight">+ Add Images</div>
          </div>
          <input
            :id="uploadId"
            name="file-upload"
            type="file"
            class="sr-only"
            accept="image/*"
            multiple
            size="10485760"
            @change="handleClickFile"
          >
        </div>
      </label>
      <div class="max-w-input relative inline-block">
        <input
          ref="validEl"
          class="pointer-events-none absolute h-0 w-0 p-0 opacity-0"
          type="text"
          :value="modelValue"
          :isValid="JSON.stringify(isValid)"
          :maximum="maximum"
          tabindex="-1"
        >
      </div>
    </div>
  </div>
</template>
