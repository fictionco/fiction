<script lang="ts" setup>
import type { MediaObject, NavItem } from '@fiction/core'
import { onResetUi, vue } from '@fiction/core'
import InputMedia from '@fiction/ui/inputs/InputMedia.vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import XMedia from '../../../../media/XMedia.vue'
import ButtonMenu from '../../el/ButtonMenu.vue'
import MediaWidthResize from './MediaWidthResize.vue'

defineOptions({ name: 'MediaSelector' })

const props = defineProps(nodeViewProps)

const media = vue.ref<MediaObject>({
  url: props.node.attrs.src,
  caption: props.node.attrs.caption,
  alt: props.node.attrs.alt,
})

const isEditing = vue.ref(false)

// Watch for changes in the media object and update node attributes accordingly
vue.watch(
  () => media.value,
  (newMedia) => {
    props.updateAttributes({
      src: newMedia?.url,
      caption: newMedia?.caption,
      alt: newMedia?.alt,
    })
  },
)
const imageFigure = vue.ref<HTMLElement>()

const imageWidth = vue.ref(props.node.attrs.width || '100%')
const aspectRatio = vue.ref(props.node.attrs.aspectRatio || 'auto')

const wrapperStyle = vue.computed(() => {
  const w = Number.parseInt(imageWidth.value)
  let margin = '0 auto'
  if (w > 100) {
    const negMargin = (w - 100) / 2
    margin = `0 -${negMargin}%`
  }
  return {
    width: imageWidth.value,
    margin,
    aspectRatio: aspectRatio.value,
    overflow: 'hidden',
  }
})

const mediaStyle = vue.computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
}))

function updateCaption(event: Event) {
  const v = (event.target as HTMLElement).textContent
  media.value = { ...media.value, caption: v || '' }
}
const subMenu = vue.ref<string | undefined>()
onResetUi(() => (subMenu.value = undefined))

function updateAspectRatio(value: 'auto' | '1 / 1' | '16 / 9' | '3 / 2' | '2 / 3' | '5 / 4') {
  props.updateAttributes({ aspectRatio: value })
  aspectRatio.value = value
}

const items = vue.computed<NavItem[]>(() => {
  return [
    {
      name: 'width',
      icon: 'i-tabler-viewport-wide',
      isActive: subMenu.value === 'width',
      onClick: ({ item }) => subMenu.value = item?.name,
      items: [
        {
          name: 'resize',
          icon: 'i-tabler-link',
          figure: {
            el: MediaWidthResize,
            props: {
              'editor': props.editor,
              'onUpdate:modelValue': (value: string) => {
                imageWidth.value = value
                props.updateAttributes({ width: value })
              },
              'modelValue': props.node.attrs.width,
            },
          },
        },
      ],
    },
    {
      name: 'aspect',
      icon: 'i-tabler-aspect-ratio',
      isActive: subMenu.value === 'aspect',
      onClick: ({ item }) => subMenu.value = item?.name,
      items: [
        {
          name: 'original',
          icon: 'i-tabler-aspect-ratio',
          onClick: () => updateAspectRatio('auto'),
        },
        {
          name: '1:1',
          icon: 'i-tabler-crop-1-1',
          onClick: () => updateAspectRatio('1 / 1'),
        },
        {
          name: '16:9',
          icon: 'i-tabler-crop-16-9',
          onClick: () => updateAspectRatio('16 / 9'),
        },
        {
          name: '3:2',
          icon: 'i-tabler-crop-3-2',
          onClick: () => updateAspectRatio('3 / 2'),
        },
        {
          name: '2:3',
          icon: 'i-tabler-crop-portrait',
          onClick: () => updateAspectRatio('2 / 3'),
        },
        {
          name: '5:4',
          icon: 'i-tabler-crop-5-4',
          onClick: () => updateAspectRatio('5 / 4'),
        },
      ],
    },
    {
      name: 'Delete',
      icon: 'i-tabler-trash',
      onClick: () => {
        const confirm = window.confirm('Are you sure?')
        if (!confirm)
          return
        const pos = props.getPos()
        if (pos != null) {
          const transaction = props.editor.state.tr.delete(pos, pos + props.node.nodeSize)
          props.editor.view.dispatch(transaction)
        }
      },
    },
  ]
})
</script>

<template>
  <NodeViewWrapper as="figure" :data-menu="media?.url ? 'image' : 'none'" class="ifigure my-6 not-prose outline-dotted outline-theme-200/30 dark:outline-theme-700 dark:focus:outline-theme-500 p-1 rounded-lg">
    <div v-if="!media?.url" class="not-prose flex justify-center p-2">
      <InputMedia v-model:model-value="media" />
    </div>
    <div v-else ref="imageFigure" class="relative group">
      <ButtonMenu :items="items" class="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100" />
      <div :style="wrapperStyle" class="media-wrapper">
        <XMedia class="w-full h-full object-cover" :style="mediaStyle" :media="media" :image-mode="!aspectRatio || aspectRatio === 'auto' ? 'inline' : 'cover'" />
      </div>
      <div
        contenteditable="true"
        placeholder="Add a caption..."
        class="cptn w-full text-center text-sm mt-4 text-theme-500 dark:text-theme-400"
        spellcheck="false"
        @input="updateCaption($event)"
        @click="isEditing = true"
      >
        {{ media.caption }}
      </div>
    </div>
  </NodeViewWrapper>
</template>
