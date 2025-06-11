<script lang="ts" setup>
import type { Editor } from '@tiptap/core'
import type { UiElementSize } from '../utils'
import { vue } from '@fiction/core'
import ProseEditor from '../prose/editor/ProseEditor.vue'
import ProseEditorToolbar from '../prose/editor/ProseEditorToolbar.vue'

defineOptions({ name: 'InputProse' })

defineProps({
  modelValue: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(payload: string): void {
  emit('update:modelValue', payload)
}

const proseEditorEl = vue.shallowRef<HTMLElement & { editor: Editor }>()

const editor = vue.computed(() => {
  return proseEditorEl.value?.editor
})
</script>

<template>
  <div class="@container w-full entry border rounded-lg border-theme-200 dark:border-theme-600/70 dark:bg-theme-900 ">
    <ProseEditorToolbar v-if="editor" :editor />
    <div class="@[1000px]:p-12 @[500px]:p-8 p-4 max-h-[350px] overflow-y-scroll overflow-x-clip no-scrollbar">
      <ProseEditor
        ref="proseEditorEl"
        class="w-full"
        :model-value="modelValue"
        @update:model-value="handleEmit($event)"
      />
    </div>
  </div>
</template>
