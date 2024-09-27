<script setup lang="ts">
import type { FictionAi } from '@fiction/plugin-ai'
import type { EditorSupplementary } from './utils/editor.js'
import { isDarkOrLightMode, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenuEngine from './el/BubbleMenuEngine.vue'
import { getExtensions } from './extensions/index'

const { modelValue = '', supplemental = {} } = defineProps<{
  modelValue: string
  supplemental?: EditorSupplementary
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const { fictionAi } = useService<{ fictionAi: FictionAi }>()

const isEditing = vue.ref(false)

const editor = useEditor({
  content: modelValue,
  extensions: getExtensions({ fictionAi, supplemental }),
  editorProps: {
    attributes: {
      class: 'ml-[-4em] mr-[-4em] pl-[4em] pr-[4em] focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    if (html !== modelValue)
      emit('update:modelValue', html)
  },
  onFocus: () => {
    isEditing.value = true
  },
  onBlur: () => {
    isEditing.value = false
  },
})

const tt = vue.ref<HTMLElement>()
vue.onMounted(() => {
  if (tt.value) {
    const md = isDarkOrLightMode(tt.value)
    tt.value.classList.add(md)
  }

  vue.watch(() => modelValue, (v) => {
    if (editor && !isEditing.value) {
      editor.value?.commands.setContent(v)
    }
  })
})
</script>

<template>
  <div ref="tt" class="tiptap-wrap">
    <div
      v-if="!editor"
      class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700"
    >
      <ElSpinner class="h-12 w-12" />
    </div>
    <template v-else>
      <BubbleMenuEngine :editor="editor" />

      <EditorContent class=" focus:outline-none" :editor="editor" data-test-id="prose-editor-content" />
    </template>
  </div>
</template>

<style lang="less">
.tiptap-wrap{
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

  .ProseMirror p.is-empty {
    &::before{
      content: attr(data-placeholder);
    float: left;
    pointer-events: none;
    height: 0;
    opacity: 0.4;
    }
    &.has-focus::before {
      opacity: 0;
    }
  }

  /* Custom image styles */

  .ProseMirror img {
    transition: filter 0.1s ease-in-out;

    &:hover {
      cursor: pointer;
      filter: brightness(90%);
    }

    &.ProseMirror-selectednode {
      outline: 3px solid #5abbf7;
      filter: brightness(90%);
    }
  }

  .autocomplete-suggestion{
    opacity: .5;
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

  @keyframes spinning {
    to {
      transform: rotate(360deg);
    }
  }

  /* Custom TODO list checkboxes – shoutout to this awesome tutorial: https://moderncss.dev/pure-css-custom-checkbox-style/ */

  ul[data-type="taskList"] li > label {
    margin-right: 0.2rem;
    user-select: none;
  }

  @media screen and (max-width: 768px) {
    ul[data-type="taskList"] li > label {
      margin-right: 0.5rem;
    }
  }

  ul[data-type="taskList"] li > label input[type="checkbox"] {
    border-radius: .3em;
    margin: 0;
    cursor: pointer;
    width: 1.2em;
    height: 1.2em;
    position: relative;
    top: .2em;
    margin-right: .8rem;
    display: grid;
    place-content: center;
  }

  ul[data-type="taskList"] li[data-checked="true"] > div > p {
    color: rgba(var(--theme-400));
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }

}

.dark .tiptap-wrap .ProseMirror {
  p.is-editor-empty:first-child::before,
  p.is-empty::before {
    color: rgba(var(--theme-500) / 0.8);
  }
}
</style>Editor,Editor,
