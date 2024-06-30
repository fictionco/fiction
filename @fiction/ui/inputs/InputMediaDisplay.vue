<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaDisplayObject } from '@fiction/core'
import ElImage from '../media/ElImage.vue'
import ElInput from './ElInput.vue'
import ElDropDown from './InputDropDown.vue'
import InputMediaUpload from './InputMediaUpload.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<MediaDisplayObject>, default: () => undefined },
  formats: { type: Object as vue.PropType<{ url?: boolean, html?: boolean }>, default: () => ({ url: true, html: true }) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaDisplayObject): void
}>()

async function updateValue(value: MediaDisplayObject): Promise<void> {
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
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-4">
      <ElDropDown
        v-if="formatList.length > 1"
        :model-value="format"
        :list="formatList"
        @update:model-value="updateValue({ format: $event as MediaDisplayObject['format'] })"
      />
      <span class="text-xs font-sans text-theme-400 dark:text-theme-500">&larr; Format</span>
    </div>
    <div v-if="format === 'html'">
      <ElInput
        class="html-textarea"
        label="HTML"
        :model-value="v.html"
        input="InputTextarea"
        :max-height="150"
        @update:model-value="updateValue({ html: $event })"
      />
    </div>
    <div v-else-if="format === 'text'">
      <ElInput
        label="Text"
        :model-value="v.html"
        input="InputText"
        @update:model-value="updateValue({ html: $event })"
      />
    </div>
    <div v-else>
      <InputMediaUpload :model-value="v" @update:model-value="updateValue($event)" />

      <div v-if="v.url" class="pt-4">
        <ElImage class="h-16 w-16 inline-block group relative" image-class="rounded-md shadow" :media="v" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.html-textarea{
  --input-size: 10px;
  line-height: 1.3;
}
</style>
