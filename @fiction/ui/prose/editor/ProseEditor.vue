<script setup lang="ts">
import type { FictionAi } from '@fiction/plugin-ai'
import type { EditorSupplementary } from './utils/editor.js'
import { isDarkOrLightMode, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenuEngine from './el/BubbleMenuEngine.vue'
import { getExtensions } from './extensions/index'

defineOptions({ name: 'ProseEditor' })

const { modelValue = '', supplemental = {}, isContentCompletionDisabled = false } = defineProps<{
  modelValue: string
  supplemental?: EditorSupplementary
  isContentCompletionDisabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const { fictionAi } = useService<{ fictionAi: FictionAi }>()

const isEditing = vue.ref(false)

const editor = useEditor({
  content: modelValue,
  extensions: getExtensions({
    fictionAi,
    getSupplemental: () => supplemental,
    checkContentCompletionDisabled: () => isContentCompletionDisabled,
  }),
  editorProps: { attributes: { class: 'focus:outline-none' } },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    if (html !== modelValue)
      emit('update:modelValue', html)
  },
  onFocus: () => (isEditing.value = true),
  onBlur: () => (isEditing.value = false),
})

const tt = vue.ref<HTMLElement>()
const isDarkMode = vue.ref(false)
vue.onMounted(() => {
  if (tt.value) {
    const md = isDarkOrLightMode(tt.value)
    tt.value.classList.add(md)
    isDarkMode.value = md === 'dark'
  }

  vue.watch(() => modelValue, (v) => {
    if (editor && !isEditing.value) {
      editor.value?.commands.setContent(v)
    }
  })
})

// Expose the editor instance
defineExpose({ editor })
</script>

<template>
  <div
    ref="tt"
    class="tiptap-wrap prose-entry"
    :class="isDarkMode ? 'dark' : 'light'"
    :data-ai-disabled="isContentCompletionDisabled ? 1 : 0"
  >
    <div
      v-if="!editor"
      class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700"
    >
      <ElSpinner class="h-12 w-12" />
    </div>
    <template v-else>
      <!-- <BubbleMenuEngine :editor="editor" /> -->

      <EditorContent class="text-lg focus:outline-none" :editor="editor" data-test-id="prose-editor-content" />
    </template>
  </div>
</template>

<style lang="less">
@import url('@fiction/ui/entry.less');
.tiptap-wrap{
  position: relative;
  .autocomplete-suggestion{
    color: rgba(var(--theme-500) / 0.5);
  }
  .dark .autocomplete-suggestion{
    color: rgba(var(--theme-700) / 0.5);
  }

  .img-placeholder {
    position: relative;

    &:before {
      content: "";
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid var(--theme-200);
      border-top-color: var(--theme-800);
      animation: spinning 0.6s linear infinite;
    }
  }

  /* Placeholder (on every new line) */
  .is-empty:not(:has(.autocomplete-suggestion))::before {
    color: rgba(var(--theme-500) / .5);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .dark .is-empty:not(:has(.autocomplete-suggestion))::before {
    color: rgba(var(--theme-700) / .5);
  }

}
</style>
