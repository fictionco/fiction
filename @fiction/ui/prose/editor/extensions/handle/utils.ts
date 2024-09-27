import type { Editor } from '@tiptap/core'
import type { EditorView } from '@tiptap/pm/view'
import { objectId } from '@fiction/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import ElSlashPanel from './ElSlashPanel.vue'
import { getSuggestionItems } from './suggestionItems'

export interface GlobalDragHandleOptions {
  dragHandleWidth: number
  scrollTreshold: number
  editor: Editor
}

export const globalDragHandlePluginKey = new PluginKey('globalDragHandle')
export const dragHandlePluginKey = new PluginKey('dragHandleMenu')

export function absoluteRect(node: Element) {
  const data = node.getBoundingClientRect()
  const modal = node.closest('[role="dialog"]')

  if (modal && window.getComputedStyle(modal).transform !== 'none') {
    const modalRect = modal.getBoundingClientRect()
    return {
      top: data.top - modalRect.top,
      left: data.left - modalRect.left,
      width: data.width,
    }
  }
  return { top: data.top, left: data.left, width: data.width }
}

export function nodeDOMAtCoords(coords: { x: number, y: number }) {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find(
      (elem: Element) =>
        elem.parentElement?.matches?.('.ProseMirror')
        || elem.matches(
          [
            'li',
            'p:not(:first-child)',
            'pre',
            'blockquote',
            'h1, h2, h3, h4, h5, h6',
          ].join(', '),
        ),
    )
}

export function nodePosAtDOM(
  node: Element,
  view: EditorView,
  options: GlobalDragHandleOptions,
) {
  const boundingRect = node.getBoundingClientRect()
  return view.posAtCoords({
    left: boundingRect.left + 50 + options.dragHandleWidth,
    top: boundingRect.top + 1,
  })?.inside
}

export function calcNodePos(pos: number, view: EditorView) {
  const $pos = view.state.doc.resolve(pos)
  return $pos.depth > 1 ? $pos.before($pos.depth) : pos
}

export function openMenuFromDragHandle(args: {
  editor: Editor
  addItemElement?: HTMLElement | null
}) {
  const { editor, addItemElement } = args

  const view = editor.view

  const { from, to } = view.state.selection
  const range = { from, to }

  let coords: { left?: number, top?: number, right?: number, bottom?: number } = { }
  if (addItemElement) {
    const { left, top, width, height } = addItemElement.getBoundingClientRect()
    coords = { left: left + width + 10, top: top + height / 2 }
  }
  else if (from) {
    coords = view.coordsAtPos(from + 1)
  }

  if (Object.keys(coords).length === 0) {
    console.error('No drag handle coordinates found.')
    return
  }

  let component: VueRenderer | null = null
  let popup: any | null = null

  // Function to handle keydown events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // eslint-disable-next-line ts/no-use-before-define
      closeMenu()
      return
    }
    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
      event.preventDefault()
      component?.ref?.onKeyDown(event)
    }
  }

  const closeMenu = () => {
    popup?.[0].destroy()
    component?.destroy()
    view.focus()
  }

  const props = {
    editor,
    range,
    query: '',
    items: getSuggestionItems({ query: '' }),
    command: (item: any) => {
      item.command({ editor, range })
      closeMenu()
    },
  }

  component = new VueRenderer(ElSlashPanel, { props, editor })

  const content = component.element

  if (!content) {
    throw new Error('No content element')
  }

  popup = tippy('body', {
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      left: coords.left,
      top: coords.top,
      right: coords.left,
      bottom: coords.top,
    } as DOMRect),
    appendTo: () => document.body,
    onHide: () => {
      view.dom.removeEventListener('keydown', handleKeyDown)
    },
    content,
    showOnCreate: true,
    interactive: true,
    trigger: 'manual',
    placement: 'auto',
  })

  // Add the event listener to the editor's DOM element
  view.dom.addEventListener('keydown', handleKeyDown)

  // Focus the editor
  view.focus()

  return {
    close: () => {
      closeMenu()
    },
  }
}
