import { Extension } from '@tiptap/core'
import { Fragment, Slice } from '@tiptap/pm/model'
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state'
// @ts-expect-error not exported publicly
import { __serializeForClipboard } from '@tiptap/pm/view'
import type { Node } from '@tiptap/pm/model'

import type { EditorView } from '@tiptap/pm/view'

const plus = `<svg  class="size-[1.4em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>`

export interface GlobalDragHandleOptions {
  /**
   * The width of the drag handle
   */
  dragHandleWidth: number

  /**
   * The treshold for scrolling
   */
  scrollTreshold: number
}
function absoluteRect(node: Element) {
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

function nodeDOMAtCoords(coords: { x: number, y: number }) {
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

function nodePosAtDOM(
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

function calcNodePos(pos: number, view: EditorView) {
  const $pos = view.state.doc.resolve(pos)
  if ($pos.depth > 1)
    return $pos.before($pos.depth)
  return pos
}

function openSlashMenuFromDragHandle(view: EditorView, dragHandle: HTMLElement | null) {
  if (!dragHandle) {
    console.error('No drag handle found.')
    return
  }
  const { left, top, width, height } = dragHandle.getBoundingClientRect()
  const coords = { left: left + width + 100, top: top + height / 2 }
  const posAtCoords = view.posAtCoords(coords)
  if (!posAtCoords) {
    console.error('No valid position found under the drag handle.')
    return
  }

  const { tr, doc, schema } = view.state
  let insertPos = posAtCoords.pos

  // Resolve the position to find the node
  const resolvedPos = doc.resolve(insertPos)
  if (resolvedPos.parent.textContent !== '') {
    // If the line is not empty, create a new paragraph below
    const paragraphType = schema.nodes.paragraph
    if (paragraphType) {
      const newNode = paragraphType.createAndFill()
      if (newNode) {
        insertPos = resolvedPos.after() // Adjust to insert after the current node
        tr.insert(insertPos, newNode)
        insertPos++ // Move position inside the new paragraph
      }
      else {
        console.error('Failed to create a new paragraph node.')
        return // Exit if the node cannot be created
      }
    }
  }

  tr.insertText('/', insertPos)
  view.dispatch(tr)

  // Set the cursor right after the slash
  view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(insertPos + 1))))
  view.focus() // Focus the editor for immediate interaction
}

function DragHandle(options: GlobalDragHandleOptions) {
  let listType = ''
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
    const diff = from - to

    const fromSelectionPos = calcNodePos(from, view)
    let differentNodeSelected = false

    const nodePos = view.state.doc.resolve(fromSelectionPos)

    // Check if nodePos points to the top level node
    if (nodePos.node().type.name === 'doc') { differentNodeSelected = true }
    else {
      const nodeSelection = NodeSelection.create(
        view.state.doc,
        nodePos.before(),
      )
      // Check if the node where the drag event started is part of the current selection
      differentNodeSelected = !(
        draggedNodePos + 1 >= nodeSelection.$from.pos
        && draggedNodePos <= nodeSelection.$to.pos
      )
    }

    if (
      !differentNodeSelected
      && diff !== 0
      && !(view.state.selection instanceof NodeSelection)
    ) {
      const endSelection = NodeSelection.create(view.state.doc, to - 1)
      const multiNodeSelection = TextSelection.create(
        view.state.doc,
        draggedNodePos,
        endSelection.$to.pos,
      )
      view.dispatch(view.state.tr.setSelection(multiNodeSelection))
    }
    else {
      const nodeSelection = NodeSelection.create(
        view.state.doc,
        draggedNodePos,
      )
      view.dispatch(view.state.tr.setSelection(nodeSelection))
    }

    // If the selected node is a list item, we need to save the type of the wrapping list e.g. OL or UL
    if (
      view.state.selection instanceof NodeSelection
      && view.state.selection.node.type.name === 'listItem'
    ) {
      listType = node.parentElement!.tagName
    }

    const slice = view.state.selection.content()
    const { dom, text } = __serializeForClipboard(view, slice)

    event.dataTransfer.clearData()
    event.dataTransfer.setData('text/html', dom.innerHTML)
    event.dataTransfer.setData('text/plain', text)
    event.dataTransfer.effectAllowed = 'copyMove'

    event.dataTransfer.setDragImage(node, 0, 0)

    view.dragging = { slice, move: event.ctrlKey }
  }

  let dragHandleElement: HTMLElement | null = null
  let handleContainerElement: HTMLElement | null = null
  let addItemElement: HTMLElement | null = null

  function hideDragHandle() {
    if (handleContainerElement)
      handleContainerElement.classList.add('opacity-0')
  }

  function showDragHandle() {
    if (handleContainerElement)
      handleContainerElement.classList.remove('opacity-0')
  }

  window.addEventListener('resize', () => {
    hideDragHandle()
  })

  window.addEventListener('scroll', () => {
    hideDragHandle()
  })

  return new Plugin({

    view: (view) => {
      // Create the parent element
      handleContainerElement = document.createElement('div')
      handleContainerElement.classList.add('handle-container', 'flex', 'items-center', 'fixed', 'transition-opacity', 'size-[1.5em]', 'text-theme-300', 'dark:text-theme-600')

      // Create the add button
      const btnClass = ['add-button', 'cursor-pointer', 'hover:text-primary-500', 'dark:hover:text-theme-0', 'hover:bg-theme-100', 'dark:hover:bg-theme-700', 'rounded-lg', 'transition-colors', 'duration-200']
      addItemElement = document.createElement('div')
      addItemElement.classList.add('add-button', 'cursor-pointer', ...btnClass)
      addItemElement.innerHTML = plus
      addItemElement.addEventListener('click', () => {
        openSlashMenuFromDragHandle(view, addItemElement)
      })

      // Create the drag handle
      dragHandleElement = addItemElement // document.createElement('div')
      dragHandleElement.classList.add('drag-handle', ...btnClass)
      dragHandleElement.setAttribute('draggable', 'true')
      dragHandleElement.innerHTML = plus // updown
      dragHandleElement.addEventListener('dragstart', e => handleDragStart(e, view))

      // Append children to the container
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
          if (!view.editable)
            return

          if (!handleContainerElement)
            return

          const editorRect = view.dom.getBoundingClientRect()
          const centerX = editorRect.left + editorRect.width / 2

          const node = nodeDOMAtCoords({ x: centerX, y: event.clientY })

          if (!(node instanceof Element) || node.matches('ul, ol')) {
            hideDragHandle()
            return
          }

          const compStyle = window.getComputedStyle(node)
          const lineHeight = Number.parseInt(compStyle.lineHeight, 10)
          const gutter = 5
          const paddingTop = Number.parseInt(compStyle.paddingTop, 10)
          const nodeRect = absoluteRect(node)
          const handleHeight = handleContainerElement.offsetHeight

          // Adjust top position based on the line height and padding
          const adjustedTop = nodeRect.top + paddingTop + (lineHeight / 2) - (handleHeight / 2)

          // Adjust left position to appear to the left of the node by taking into account the handleContainerElement's width
          let adjustedLeft = nodeRect.left - handleContainerElement.offsetWidth - gutter // This will get the width dynamically

          // Adjust for list item markers if necessary
          if (node.matches('ul:not([data-type=taskList]) li, ol li'))
            adjustedLeft -= 30 // You may adjust this value as needed

          // Apply the adjusted positions to the handleContainerElement
          if (handleContainerElement) {
            handleContainerElement.style.left = `${adjustedLeft}px`
            handleContainerElement.style.top = `${adjustedTop}px`
            showDragHandle()
          }
        },

        keydown: () => {
          hideDragHandle()
        },
        mousewheel: () => {
          hideDragHandle()
        },
        // dragging class is used for CSS
        dragstart: (view) => {
          view.dom.classList.add('dragging')
        },
        drop: (view, event) => {
          view.dom.classList.remove('dragging')
          hideDragHandle()
          let droppedNode: Node | null = null
          const dropPos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })

          if (!dropPos)
            return

          if (view.state.selection instanceof NodeSelection)
            droppedNode = view.state.selection.node

          if (!droppedNode)
            return

          const resolvedPos = view.state.doc.resolve(dropPos.pos)

          const isDroppedInsideList
            = resolvedPos.parent.type.name === 'listItem'

          // If the selected node is a list item and is not dropped inside a list, we need to wrap it inside <ol> tag otherwise ol list items will be transformed into ul list item when dropped
          if (
            view.state.selection instanceof NodeSelection
            && view.state.selection.node.type.name === 'listItem'
            && !isDroppedInsideList
            && listType === 'OL'
          ) {
            const text = droppedNode.textContent
            if (!text)
              return
            const paragraph = view.state.schema.nodes.paragraph?.createAndFill(
              {},
              view.state.schema.text(text),
            )
            const listItem = view.state.schema.nodes.listItem?.createAndFill(
              {},
              paragraph,
            )

            const newList = view.state.schema.nodes.orderedList?.createAndFill(
              null,
              listItem,
            )
            const slice = new Slice(Fragment.from(newList), 0, 0)
            view.dragging = { slice, move: event.ctrlKey }
          }
        },
        dragend: (view) => {
          view.dom.classList.remove('dragging')
        },
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
    return [
      DragHandle({
        dragHandleWidth: this.options.dragHandleWidth,
        scrollTreshold: this.options.scrollTreshold,
      }),
    ]
  },
})

export default GlobalDragHandle
