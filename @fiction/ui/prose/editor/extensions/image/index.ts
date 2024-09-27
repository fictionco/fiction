import type { vue } from '@fiction/core'
import { mergeAttributes, Node, type NodeViewProps } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaSelector from './MediaSelector.vue'

const videoExtensions = ['mp4', 'webm', 'ogg']

export const xImage = Node.create({
  name: 'xImage',
  group: 'block',
  draggable: true,
  selectable: true,

  addNodeView() {
    return VueNodeViewRenderer(MediaSelector as vue.Component<NodeViewProps>)
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.querySelector('img, video')?.getAttribute('src'),
      },
      alt: {
        default: null,
        parseHTML: element => element.querySelector('img, video')?.getAttribute('alt'),
      },
      caption: {
        default: null,
        parseHTML: element => element.querySelector('figcaption')?.textContent,
      },
      width: {
        default: '100%', // Default width as 100% for full-width images
        parseHTML: element => element.querySelector<HTMLElement>('.media-wrapper')?.style.width || '100%',
      },
      align: {
        default: 'center',
        parseHTML: element => element.style.textAlign,
      },
      isVideo: {
        default: false,
        parseHTML: element => !!element.querySelector('video'),
      },
      aspectRatio: {
        default: null,
        parseHTML: element => element.querySelector<HTMLElement>('.media-wrapper')?.style.aspectRatio,
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
    const isVideo = node.attrs.isVideo || videoExtensions.some(ext => node.attrs.src?.toLowerCase().endsWith(`.${ext}`))
    const wrapperStyle = `width: ${node.attrs.width}; ${node.attrs.aspectRatio ? `aspect-ratio: ${node.attrs.aspectRatio};` : ''} overflow: hidden;`
    const mediaStyle = 'width: 100%; height: 100%; object-fit: cover;'
    const figureStyle = `text-align: ${node.attrs.align};`

    const mediaElement = isVideo
      ? ['video', mergeAttributes({ src: node.attrs.src, controls: true, style: mediaStyle })]
      : ['img', mergeAttributes({ src: node.attrs.src, alt: node.attrs.alt, style: mediaStyle })]

    return [
      'figure',
      mergeAttributes({ 'data-x-image': '', 'style': figureStyle }),
      ['div', { class: 'media-wrapper', style: wrapperStyle }, mediaElement],
      ['figcaption', { style: 'font-size: 0.8em;' }, node.attrs.caption || ''],
    ]
  },
})
