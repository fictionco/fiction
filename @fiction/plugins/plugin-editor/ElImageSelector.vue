<script lang="ts" setup>
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
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

function updateCaption(event: Event) {
  const v = (event.target as HTMLElement).textContent
  media.value = { ...media.value, caption: v || '' }
}
</script>

<template>
  <NodeViewWrapper>
    <div class="not-prose">
      <div v-if="!media?.url" class="bg-theme-50 border border-theme-200 dark:bg-theme-800 dark:border-theme-700 rounded-lg">
        <InputMediaUpload v-model:model-value="media" />
      </div>
      <div v-else>
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
    </div>
  </NodeViewWrapper>
</template>

<style lang="less">
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
</style>
