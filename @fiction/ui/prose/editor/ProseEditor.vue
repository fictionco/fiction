<script setup lang="ts">
import type { ColorThemeUser } from '@fiction/core'
import type { FictionAi } from '@fiction/plugin-ai'
import type { EditorSupplementary } from './utils/editor.js'
import { useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import XEntry from '../XEntry.vue'
import { getExtensions } from './extensions/index'

defineOptions({ name: 'ProseEditor' })

const { modelValue = '', supplemental = {}, isContentCompletionDisabled = false, theme = 'blue' } = defineProps<{
  modelValue: string
  supplemental?: EditorSupplementary
  isContentCompletionDisabled?: boolean
  theme?: ColorThemeUser
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
  // the margin helps with drag hover UX / focus outline prevents rings from appearing awkwardly
  editorProps: { attributes: { class: 'ml-[-2em] mr-[-2em] pl-[2em] pr-[2em] focus:outline-none' } },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    if (html !== modelValue)
      emit('update:modelValue', html)
  },
  onFocus: () => (isEditing.value = true),
  onBlur: () => (isEditing.value = false),
})

vue.onMounted(() => {
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
  <XEntry
    :theme
    class="tiptap-wrap @container/prose"
    :data-ai-disabled="isContentCompletionDisabled ? 1 : 0"
  >
    <div class="text-sm @[350px]/prose:text-base @[700px]/prose:text-2xl">
      <div
        v-if="!editor"
        class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700"
      >
        <ElSpinner class="h-12 w-12" />
      </div>
      <template v-else>
        <!-- <BubbleMenuEngine :editor="editor" /> -->

        <EditorContent
          class=" focus:outline-none"
          :editor="editor"
          data-test-id="prose-editor-content"
        />
      </template>
    </div>
  </XEntry>
</template>

<style lang="less">
.tiptap-wrap{
  position: relative;
  .autocomplete-suggestion{
    color: rgba(var(--theme-600) / .5);
  }
  .dark .autocomplete-suggestion{
    color: rgba(var(--theme-600) / .5);
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
    color: rgba(var(--theme-600) / .5);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .dark .is-empty:not(:has(.autocomplete-suggestion))::before {
    color: rgba(var(--theme-600) / .5);
  }

  // for editing text in image component, etc.
  [contentEditable="true"]:focus{
    outline: none;
  }
  [contentEditable="true"]:empty {
    &::before {
      content: attr(placeholder);
      opacity: 0.4;
    }

    &:hover:not(:focus)::before {
      cursor: pointer;
      opacity: 0.65;
    }

    &:focus::before {
      opacity: 0.2;
    }
  }

}
</style>
