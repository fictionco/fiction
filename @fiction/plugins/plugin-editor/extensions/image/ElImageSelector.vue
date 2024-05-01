<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import InputMediaUpload from '@fiction/ui/InputMediaUpload.vue'
import type { MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'
import ButtonMenu from '../../el/ButtonMenu.vue'
import ElImageResize from './ElImageResize.vue'

const props = defineProps(nodeViewProps)

const media = vue.ref<MediaDisplayObject>({
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

const imageStyle = vue.computed(() => {
  const w = Number.parseInt(imageWidth.value)
  let margin = '0 auto'
  if (w > 100) {
    const negMargin = (w - 100) / 2
    margin = `0 -${negMargin}%`
  }
  return { width: imageWidth.value, margin }
})

function updateCaption(event: Event) {
  const v = (event.target as HTMLElement).textContent
  media.value = { ...media.value, caption: v || '' }
}

const items = vue.computed(() => {
  return [
    {
      name: 'Settings',
      icon: 'i-tabler-settings',
      items: [
        {
          name: 'linkInput',
          icon: 'i-tabler-link',
          figure: {
            el: ElImageResize,
            props: {
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
      name: 'Delete',
      icon: 'i-tabler-x',
      onClick: () => {
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
    <div v-if="!media?.url" class="p-4 not-prose">
      <InputMediaUpload v-model:model-value="media" />
    </div>
    <div v-else ref="imageFigure" class="relative group">
      <ButtonMenu :items="items" class="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100" />
      <div :style="imageStyle">
        <img class="w-full" :src="media?.url" :alt="media?.alt">
        <figcaption

          contenteditable="true"
          placeholder="Testing"
          class="cptn w-full text-center text-sm mt-4 text-theme-500 dark:text-theme-400"
          spellcheck="false"
          @input="updateCaption($event)"
          @click="isEditing = true"
        >
          {{ media.caption }}
        </figcaption>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style lang="less">

</style>
