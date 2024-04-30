import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploader from './ElImageSelector.vue'

export const ImageSelector = Node.create({
  name: 'imageSelector',

  group: 'block',

  atom: true,
  selectable: false,

  addNodeView() {
    return VueNodeViewRenderer(ImageUploader)
  },
})
