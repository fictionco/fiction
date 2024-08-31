<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import type { MediaObject } from '@fiction/core'
import ElImage from '../media/ElImage.vue'
import ElModal from '../ElModal.vue'
import XButton from '../buttons/XButton.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import ElInput from './ElInput.vue'
import ElDropDown from './InputDropDown.vue'
import InputMediaUpload from './InputMediaUpload.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => undefined },
  formats: { type: Object as vue.PropType<{ url?: boolean, html?: boolean }>, default: () => ({ url: true, html: true }) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

async function updateValue(value: MediaObject): Promise<void> {
  emit('update:modelValue', { ...props.modelValue, ...value })
}

const v = vue.computed(() => props.modelValue || {})

const formatList = vue.computed(() => {
  const list = []
  if (props.formats.url)
    list.push({ value: 'url', name: 'Image URL' })
  if (props.formats.html)
    list.push({ value: 'html', name: 'Inline HTML / SVG' })
  return list
})

const format = vue.computed(() => {
  if (v.value.format)
    return v.value.format
  else if (v.value.html && !v.value.url)
    return 'html'
  else
    return 'url'
})

const vis = vue.ref()
const navItems = [{ name: 'Upload Image/Video', value: 'upload' }]
const navItemActive = vue.ref(navItems[0])
const uploading = vue.ref(false)
</script>

<template>
  <div>
    <div>
      <XButton rounding="full" theme="primary" icon="i-tabler-upload" size="sm" @click.stop.prevent="vis = true">
        Select Media
      </XButton>
    </div>
    <ElModal v-model:vis="vis">
      <div class="media-gallery grid grid-cols-12 py-2 px-4 text-sm">
        <div class="nav col-span-12">
          <div
            class="grid grid-cols-1 items-center justify-center gap-3 text-xs"
          >
            <div
              v-for="(item, i) in navItems"
              :key="i"
              class="rounded-md py-2 px-3 text-center"
              :class="
                item === navItemActive
                  ? `text-white bg-theme-600 font-semibold`
                  : `text-theme-500 cursor-pointer bg-theme-200 hover:text-theme-700`
              "
              @click="navItemActive = item"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="uploading" class="p-12">
        <ElSpinner class="m-auto size-12 text-theme-200" />
      </div>
      <div v-else-if="navItemActive.value === 'upload'">
        <InputMediaUpload :model-value="v" @update:model-value="updateValue($event)" />
      </div>

      <div v-else class="">
        -----library-----
      </div>
    </ElModal>
  </div>
</template>
