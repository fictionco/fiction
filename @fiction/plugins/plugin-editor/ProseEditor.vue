<script setup lang="ts">
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3'
import type { NavItem } from '@fiction/core'
import { onResetUi, vue } from '@fiction/core'
import { extensions } from './extensions'

const props = defineProps({
  content: { type: String, default: '' },
})

const editor = useEditor({
  content: props.content,
  extensions,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})

const bubbleSubMenu = vue.ref<string>()

onResetUi(() => {
  bubbleSubMenu.value = undefined
})

const bubbleMenuButtons = vue.computed<NavItem[]>(() => {
  const e = editor.value

  if (!e)
    return []

  return [
    {
      name: 'heading',
      isActive: bubbleSubMenu.value === 'heading',
      icon: 'i-tabler-heading',
      onClick: ({ item }) => bubbleSubMenu.value = item?.name,
      items: [
        {
          name: 'heading-h1',
          isActive: e.isActive('heading', { level: 1 }) || false,
          icon: 'i-ci-heading-h1',
          onClick: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          name: 'heading-h2',
          isActive: e.isActive('heading', { level: 2 }) || false,
          icon: 'i-ci-heading-h2',
          onClick: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          name: 'heading-h3',
          isActive: e.isActive('heading', { level: 3 }) || false,
          icon: 'i-ci-heading-h3',
          onClick: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          name: 'heading-h4',
          isActive: e.isActive('heading', { level: 4 }) || false,
          icon: 'i-ci-heading-h4',
          onClick: () => e.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
          name: 'heading-h5',
          isActive: e.isActive('heading', { level: 5 }) || false,
          icon: 'i-ci-heading-h5',
          onClick: () => e.chain().focus().toggleHeading({ level: 5 }).run(),
        },
        {
          name: 'heading-h6',
          isActive: e.isActive('heading', { level: 6 }) || false,
          icon: 'i-ci-heading-h6',
          onClick: () => e.chain().focus().toggleHeading({ level: 6 }).run(),
        },
        {
          name: 'paragraph',
          isActive: e.isActive('paragraph') || false,
          icon: 'i-ci-paragraph',
          onClick: () => e.chain().focus().setParagraph().run(),
        },
      ],
    },

    {
      name: 'bold',
      isActive: e.isActive('bold'),
      icon: 'i-tabler-bold',
      onClick: () => e.chain().focus().toggleBold().run(),
    },
    {
      name: 'italic',
      isActive: e.isActive('italic'),
      icon: 'i-tabler-italic',
      onClick: () => e.chain().focus().toggleItalic().run(),
    },
    {
      name: 'strike',
      isActive: e.isActive('strike'),
      icon: 'i-tabler-strikethrough',
      onClick: () => e.chain().focus().toggleStrike().run(),
    },
    {
      name: 'highlight',
      isActive: e.isActive('highlight'),
      icon: 'i-tabler-highlight',
      onClick: () => e.chain().focus().toggleHighlight().run(),
    },
    {
      name: 'link',
      isActive: e.isActive('link'),
      icon: 'i-tabler-link',
      onClick: () => e.chain().focus().toggleLink({ href: 'https://example.com' }).run(),
    },
    {
      name: 'align',
      isActive: bubbleSubMenu.value === 'align',
      icon: 'i-tabler-align-left',
      onClick: ({ item }) => bubbleSubMenu.value = item?.name,
      items: [
        {
          name: 'left',
          isActive: e.isActive({ textAlign: 'left' }),
          icon: 'i-tabler-align-left',
          onClick: () => e.chain().focus().setTextAlign('left').run(),
        },
        {
          name: 'center',
          isActive: e.isActive({ textAlign: 'center' }),
          icon: 'i-tabler-align-center',
          onClick: () => e.chain().focus().setTextAlign('center').run(),
        },
        {
          name: 'right',
          isActive: e.isActive({ textAlign: 'right' }),
          icon: 'i-tabler-align-right',
          onClick: () => e.chain().focus().setTextAlign('right').run(),
        },
        {
          name: 'justify',
          isActive: e.isActive({ textAlign: 'justify' }),
          icon: 'i-tabler-align-justified',
          onClick: () => e.chain().focus().setTextAlign('justify').run(),
        },
      ],
    },

  ]
})
</script>

<template>
  <div class="prose tiptap mx-auto my-20 p-4">
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="isolate inline-flex rounded-md shadow-sm"
      @click.stop
    >
      <div
        v-for="(item, i) in bubbleMenuButtons"
        :key="i"
        class="relative"
      >
        <button

          type="button"
          :class="[
            i !== 0 ? '-ml-px' : 'rounded-l-md',
            i === bubbleMenuButtons.length - 1 ? 'rounded-r-md' : '',
            item.isActive ? 'bg-theme-200' : '']"
          class="relative inline-flex items-center  bg-white px-3 py-2 text-sm font-semibold text-theme-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          @click="item.onClick ? item.onClick({ event: $event, item }) : ''"
        >
          <span class="text-lg" :class="item.icon" :title="item.name" />
          <span v-if="item.items" class="text-lg i-tabler-chevron-down" />
        </button>

        <div
          v-if="item.items"
          v-show="bubbleSubMenu === item.name"
          class="absolute z-10 mt-2 transform px-2  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
        >
          <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="relative inline-flex  bg-theme-0 ">
              <template v-for="(subItem, ii) in item.items" :key="ii">
                <button
                  type="button"
                  class="relative inline-flex items-center  bg-white px-3 py-2 text-sm font-semibold text-theme-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  :class="[
                    ii !== 0 ? '-ml-px' : 'rounded-l-md',
                    ii === item.items.length - 1 ? 'rounded-r-md' : '',
                    item.isActive ? 'bg-theme-200' : '']"
                  @click="subItem.onClick ? subItem.onClick({ event: $event, item }) : ''"
                >
                  <span class="text-base" :class="subItem.icon" :title="item.name" />
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </BubbleMenu>
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
