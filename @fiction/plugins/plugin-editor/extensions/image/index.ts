import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploader from './ElImageSelector.vue'

export const xImage = Node.create({
  name: 'xImage',
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
      },
      alt: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('alt'),
      },
      caption: {
        default: null,
        parseHTML: element => element.querySelector('figcaption')?.textContent,
      },
      width: {
        default: '100%', // Default width as 100% for full-width images
        parseHTML: element => element.querySelector('img')?.style.width || '100%',
      },
      align: {
        default: 'center',
        parseHTML: element => element.style.textAlign,
      },
    }
  },

  // turns the HTML element into the component
  parseHTML() {
    return [{
      tag: 'figure[data-x-image]',
    }]
  },

  renderHTML({ node }) {
    const imgStyle = `max-width: 100%; height: auto; width: ${node.attrs.width};`
    const figureStyle = `text-align: ${node.attrs.align};`

    return [
      'figure',
      mergeAttributes({ 'data-x-image': '', 'style': figureStyle }),
      ['img', mergeAttributes({ src: node.attrs.src, alt: node.attrs.alt, style: imgStyle })],
      ['figcaption', { style: 'font-size: 0.8em;' }, node.attrs.caption || ''],
    ]
  },
})
