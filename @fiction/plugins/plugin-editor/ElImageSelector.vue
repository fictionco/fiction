<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import InputMediaUpload from '@fiction/ui/InputMediaUpload.vue'
import type { MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'

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

function updateCaption(event: Event) {
  const v = (event.target as HTMLElement).textContent
  media.value = { ...media.value, caption: v || '' }
}
</script>

<template>
  <NodeViewWrapper as="figure" :data-menu="media?.url ? 'image' : 'none'" class="ifigure not-prose outline-dotted outline-theme-200/30 dark:outline-theme-700/30 dark:focus:outline-theme-500 p-1 rounded-lg">
    <div v-if="!media?.url" class="p-8">
      <InputMediaUpload v-model:model-value="media" />
    </div>
    <div v-else ref="imageFigure">
      <img class="w-full" :src="media?.url" :alt="media?.alt">
      <figcaption
        class="cptn w-full focus:outline-none p-4 text-center font-sans"
        contenteditable="true"
        placeholder="Testing"
        spellcheck="false"
        @input="updateCaption($event)"
        @click="isEditing = true"
      >
        {{ media.caption }}
      </figcaption>
    </div>
  </NodeViewWrapper>
</template>

<style lang="less">
.ifigure{

  &.has-focus {
  outline-color: rgba(var(--primary-500) / 0.3);
}
}
.cptn[contentEditable="true"]:empty {
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
</style>import tippy from 'tippy.js';
import tippy from 'tippy.js';
