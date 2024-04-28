<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { extensions } from './extensions'

const editor = useEditor({
  content: `<p>I'm running Tiptap with Vue.js. 🎉</p>`,
  extensions,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
</script>

<template>
  <div class="prose tiptap">
    <div v-if="editor">
      <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
        h1
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
        h2
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
        h3
      </button>
      <button :class="{ 'is-active': editor.isActive('paragraph') }" @click="editor?.chain().focus().setParagraph().run()">
        paragraph
      </button>
      <button :class="{ 'is-active': editor.isActive('bold') }" @click="editor?.chain().focus().toggleBold().run()">
        bold
      </button>
      <button :class="{ 'is-active': editor.isActive('italic') }" @click="editor?.chain().focus().toggleItalic().run()">
        italic
      </button>
      <button :class="{ 'is-active': editor.isActive('strike') }" @click="editor?.chain().focus().toggleStrike().run()">
        strike
      </button>
      <button :class="{ 'is-active': editor.isActive('highlight') }" @click="editor?.chain().focus().toggleHighlight().run()">
        highlight
      </button>
      <button :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" @click="editor?.chain().focus().setTextAlign('left').run()">
        left
      </button>
      <button :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" @click="editor?.chain().focus().setTextAlign('center').run()">
        center
      </button>
      <button :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" @click="editor?.chain().focus().setTextAlign('right').run()">
        right
      </button>
      <button :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" @click="editor?.chain().focus().setTextAlign('justify').run()">
        justify
      </button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style lang="less">
/* Basic editor styles */
.tiptap {
  margin-top: 1rem;

  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>
