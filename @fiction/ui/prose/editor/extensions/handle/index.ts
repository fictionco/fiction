import type { Node } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'
import type {
  GlobalDragHandleOptions,
} from './utils'
import { Extension } from '@tiptap/core'
import { Fragment, Slice } from '@tiptap/pm/model'
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state'

import {
  absoluteRect,
  calcNodePos,
  dragHandlePluginKey,
  globalDragHandlePluginKey,
  nodeDOMAtCoords,
  nodePosAtDOM,
  openMenuFromDragHandle,
} from './utils'

function DragHandle(options: GlobalDragHandleOptions) {
  let listType = ''
  let dragHandleElement: HTMLElement | null = null
  let handleContainerElement: HTMLElement | null = null
  let addItemElement: HTMLElement | null = null
  const { editor } = options

  function handleDragStart(event: DragEvent, view: EditorView) {
    view.focus()
    if (!event.dataTransfer)
      return

    const node = nodeDOMAtCoords({ x: event.clientX + 50 + options.dragHandleWidth, y: event.clientY })
    if (!(node instanceof Element))
      return

    let draggedNodePos = nodePosAtDOM(node, view, options)
    if (draggedNodePos == null || draggedNodePos < 0)
      return
    draggedNodePos = calcNodePos(draggedNodePos, view)

    const { from, to } = view.state.selection
    const fromSelectionPos = calcNodePos(from, view)
    const nodePos = view.state.doc.resolve(fromSelectionPos)
    const differentNodeSelected = nodePos.node().type.name === 'doc'
      || !(draggedNodePos + 1 >= NodeSelection.create(view.state.doc, nodePos.before()).$from.pos
        && draggedNodePos <= NodeSelection.create(view.state.doc, nodePos.before()).$to.pos)

    if (!differentNodeSelected && from !== to && !(view.state.selection instanceof NodeSelection)) {
      const endSelection = NodeSelection.create(view.state.doc, to - 1)
      const multiNodeSelection = TextSelection.create(view.state.doc, draggedNodePos, endSelection.$to.pos)
      view.dispatch(view.state.tr.setSelection(multiNodeSelection))
    }
    else {
      const nodeSelection = NodeSelection.create(view.state.doc, draggedNodePos)
      view.dispatch(view.state.tr.setSelection(nodeSelection))
    }

    if (view.state.selection instanceof NodeSelection && view.state.selection.node.type.name === 'listItem') {
      listType = node.parentElement!.tagName
    }

    const slice = view.state.selection.content()

    const { dom, text } = view.serializeForClipboard(slice)

    event.dataTransfer.clearData()
    event.dataTransfer.setData('text/html', dom.innerHTML)
    event.dataTransfer.setData('text/plain', text)
    event.dataTransfer.effectAllowed = 'copyMove'
    event.dataTransfer.setDragImage(node, 0, 0)

    view.dragging = { slice, move: event.ctrlKey }
  }

  function hideDragHandle() {
    if (handleContainerElement)
      handleContainerElement.classList.add('opacity-0')
  }

  function showDragHandle() {
    if (handleContainerElement)
      handleContainerElement.classList.remove('opacity-0')
  }

  window.addEventListener('resize', hideDragHandle)
  window.addEventListener('scroll', hideDragHandle)

  return new Plugin({
    view: (view) => {
      handleContainerElement = document.createElement('div')
      handleContainerElement.classList.add(
        'handle-container',
        'flex',
        'items-center',
        'justify-end',
        'absolute',
        'transition-opacity',
        'size-[1.5em]',
        'p-0.5',
        'text-theme-500',
        'dark:text-theme-800/0',
        'text-[0.8em]',
      )

      const btnClass = ['add-button', 'flex', 'justify-center', 'cursor-grab', 'hover:text-primary-500', 'dark:hover:text-theme-500', 'rounded-md', 'transition-colors', 'duration-200']
      const plus = `<span class="i-tabler-grip-vertical" />`

      addItemElement = document.createElement('div')
      addItemElement.classList.add('add-button', 'cursor-grab', ...btnClass)
      addItemElement.innerHTML = plus
      addItemElement.addEventListener('click', () => {
        const plugin = openMenuFromDragHandle({ editor, addItemElement })
        view.dispatch(view.state.tr.setMeta(dragHandlePluginKey, { action: 'add', plugin }))
      })

      dragHandleElement = addItemElement
      dragHandleElement.classList.add('drag-handle', ...btnClass)
      dragHandleElement.setAttribute('draggable', 'true')
      dragHandleElement.innerHTML = plus
      dragHandleElement.addEventListener('dragstart', e => handleDragStart(e, view))

      handleContainerElement.appendChild(addItemElement)
      handleContainerElement.appendChild(dragHandleElement)

      dragHandleElement.addEventListener('drag', (e) => {
        hideDragHandle()
        const scrollY = window.scrollY
        if (e.clientY < options.scrollTreshold)
          window.scrollTo({ top: scrollY - 30, behavior: 'smooth' })
        else if (window.innerHeight - e.clientY < options.scrollTreshold)
          window.scrollTo({ top: scrollY + 30, behavior: 'smooth' })
      })

      hideDragHandle()

      view?.dom?.parentElement?.appendChild(handleContainerElement)

      return {
        destroy: () => {
          handleContainerElement?.remove?.()
          dragHandleElement?.remove?.()
          dragHandleElement = null
        },
      }
    },
    props: {
      handleDOMEvents: {
        mousemove: (view, event) => {
          if (!view.editable || !handleContainerElement)
            return

          const editorRect = view.dom.getBoundingClientRect()
          const containerRect = view.dom.closest('.tiptap-wrap')?.getBoundingClientRect()

          if (!containerRect)
            return

          const centerX = editorRect.left + editorRect.width / 2
          const node = nodeDOMAtCoords({ x: centerX, y: event.clientY })

          if (!(node instanceof Element) || node.matches('ul, ol')) {
            hideDragHandle()
            return
          }

          const compStyle = window.getComputedStyle(node)
          const lineHeight = Number.parseInt(compStyle.lineHeight, 10)
          const paddingTop = Number.parseInt(compStyle.paddingTop, 10)
          const nodeRect = absoluteRect(node)
          const handleHeight = handleContainerElement.offsetHeight

          // Calculate positions relative to container
          const adjustedTop = nodeRect.top - containerRect.top + paddingTop + (lineHeight / 2) - (handleHeight / 2)
          let adjustedLeft = nodeRect.left - containerRect.left - handleContainerElement.offsetWidth - 5

          if (node.matches('ul:not([data-type=taskList]) li, ol li'))
            adjustedLeft -= 30

          handleContainerElement.style.left = `${adjustedLeft}px`
          handleContainerElement.style.top = `${adjustedTop}px`
          showDragHandle()
        },
        keydown: hideDragHandle,
        mousewheel: hideDragHandle,
        scroll: hideDragHandle,
        dragstart: view => view.dom.classList.add('dragging'),
        drop: (view, event) => {
          view.dom.classList.remove('dragging')
          hideDragHandle()
          let droppedNode: Node | null = null
          const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY })

          if (!dropPos)
            return

          if (view.state.selection instanceof NodeSelection)
            droppedNode = view.state.selection.node

          if (!droppedNode)
            return

          const resolvedPos = view.state.doc.resolve(dropPos.pos)
          const isDroppedInsideList = resolvedPos.parent.type.name === 'listItem'

          if (
            view.state.selection instanceof NodeSelection
            && view.state.selection.node.type.name === 'listItem'
            && !isDroppedInsideList
            && listType === 'OL'
          ) {
            const text = droppedNode.textContent
            if (!text)
              return
            const paragraph = view.state.schema.nodes.paragraph?.createAndFill({}, view.state.schema.text(text))
            const listItem = view.state.schema.nodes.listItem?.createAndFill({}, paragraph)
            const newList = view.state.schema.nodes.orderedList?.createAndFill(null, listItem)
            const slice = new Slice(Fragment.from(newList), 0, 0)
            view.dragging = { slice, move: event.ctrlKey }
          }
        },
        dragend: view => view.dom.classList.remove('dragging'),

      },
    },
  })
}

const GlobalDragHandle = Extension.create({
  name: 'globalDragHandle',

  addOptions() {
    return { dragHandleWidth: 5, scrollTreshold: 100 }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const { dragHandleWidth, scrollTreshold } = this.options
    return [
      DragHandle({ dragHandleWidth, scrollTreshold, editor }),
      new Plugin({
        key: globalDragHandlePluginKey,
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === '/') {
              openMenuFromDragHandle({ editor })

              return true
            }
            return false
          },
        },
      }),
    ]
  },

})

export default GlobalDragHandle
