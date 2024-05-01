<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { isDarkOrLightMode, vue } from '@fiction/core'
import { extensions } from './extensions'
import BubbleMenuText from './el/BubbleMenuText.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions,
  editorProps: {
    attributes: {
      class: 'ml-[-4em] mr-[-4em] pl-[4em] pr-[4em] focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    if (html !== props.modelValue)
      emit('update:modelValue', html)
  },

})

const tt = vue.ref<HTMLElement>()
vue.onMounted(() => {
  if (tt.value) {
    const md = isDarkOrLightMode(tt.value)
    tt.value.classList.add(md)
  }
})
</script>

<template>
  <div v-if="editor" ref="tt" class="tiptap-wrap px-6">
    <BubbleMenuText :editor="editor" />

    <EditorContent class="prose dark:prose-invert prose-sm lg:prose-lg xl:prose-2xl mx-auto focus:outline-none" :editor="editor" />
  </div>
</template>

<style lang="less">
.tiptap-wrap{
  .suggestion{
    opacity: 0;
  }

  .ProseMirror p.is-editor-empty:first-child::before,
  .ProseMirror p.is-empty::before {
    content: attr(data-placeholder);
    float: left;
    pointer-events: none;
    height: 0;
    color: rgba(var(--theme-300));
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
</style>
