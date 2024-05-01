import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploader from './ElImageSelector.vue'

export const ImageSelector = Node.create({
  name: 'imageSelector',
  group: 'block',
  draggable: true,
  selectable: true,

  addNodeView() {
    return VueNodeViewRenderer(ImageUploader)
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('src'),
        renderHTML: attributes => ({ src: attributes.src }),
      },
      alt: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('alt'),
        renderHTML: attributes => ({ alt: attributes.alt }),
      },
      caption: {
        default: null,
        parseHTML: (element) => {
          const cptn = element.querySelector('figcaption')?.textContent
          console.warn('CAP', cptn)
          return cptn
        },
        renderHTML: attributes => ({ caption: attributes.caption }),
      },
    }
  },

  // turns the HTML element into the component
  parseHTML() {
    return [{
      tag: 'figure[data-image-selector]',
      // getAttrs: node => ({
      //   src: node.querySelector('img')?.getAttribute('src'),
      //   alt: node.querySelector('img')?.getAttribute('alt'),
      //   caption: node.querySelector('figcaption')?.textContent,
      // }),
    }]
  },

  renderHTML({ node }) {
    return [
      'figure',
      { 'data-image-selector': '', 'style': 'position: relative; text-align: center;' },
      ['img', mergeAttributes({ style: 'max-width: 100%; height: auto;' }, { src: node.attrs.src, alt: node.attrs.alt })],
      ['figcaption', { class: 'font-size: 0.8em;' }, node.attrs.caption || ''],
    ]
  },
})
