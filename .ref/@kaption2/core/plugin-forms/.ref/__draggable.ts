import { FactorObject, onBrowserEvent, vue } from '@factor/api'

interface DraggableListSettings {
  wrapClass: string
  draggableClass: string
  ghostClasses: string[]
  onUpdate: () => void
}

export class DraggableList extends FactorObject<DraggableListSettings> {
  reset?: () => void
  throttleDrag = vue.ref(false)
  draggedEl = vue.ref<HTMLElement>()
  nextEl = vue.ref<HTMLElement>()
  ghostClasses = vue.ref<string[]>(this.settings.ghostClasses || [])
  wrapClass = this.settings.wrapClass
  draggableClass = this.settings.draggableClass
  draggingClass = 'dragging'
  onUpdate = this.settings.onUpdate
  dragIndex = -1
  wrapEl?: HTMLElement
  parentEl?: HTMLElement
  constructor(settings: DraggableListSettings) {
    super('draggable', settings)

    this.addStyles()
    this.enable()
  }

  /**
   * remove pointer events on everything inside draggables to
   * prevent events being called on their contents
   */
  addStyles() {
    const styleId = `draggable-${this.draggableClass}`
    const el = document.querySelector(`#${styleId}`)
    if (el)
      return
    const styleSheet = document.createElement('style')
    styleSheet.setAttribute('type', 'text/css')
    styleSheet.id = styleId
    styleSheet.textContent = `.${this.draggableClass}.${this.draggingClass} * { pointer-events: none; }`
    document.head.append(styleSheet)
  }

  getMouseOffset(evt: DragEvent) {
    const el = evt.target as HTMLElement
    const targetRect = el.getBoundingClientRect()
    const offset = {
      x: evt.pageX - targetRect.left,
      y: evt.pageY - targetRect.top,
    }
    return offset
  }

  getElementVerticalCenter(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    return (rect.bottom - rect.top) / 2
  }

  // appendPlaceholder(evt: DragEvent, ind: number) {
  //   evt.preventDefault()
  //   if (ind === this.dragIndex) {
  //     return
  //   }
  //   const target = evt.target as HTMLElement
  //   const offset = this.getMouseOffset(evt)
  //   const middleY = this.getElementVerticalCenter(target)
  //   const placeholder = this.wrapEl?.children[this.dragIndex] as HTMLElement

  //   // console.log(`hover on ${idx} ${offset.y > middleY ? 'bottom half' : 'top half'}`)
  //   if (offset.y > middleY) {
  //     this.wrapEl?.insertBefore(evt.target as HTMLElement, placeholder)
  //   } else if (this.wrapEl?.children[ind + 1]) {
  //     const nextTarget = target?.nextSibling
  //     const el = nextTarget || target
  //     this.wrapEl?.insertBefore(el, placeholder)
  //   }
  //   return
  // }

  enable(): void {
    if (this.reset)
      this.reset()

    // allow dom transforms to happen
    setTimeout(() => {
      this.reset = onBrowserEvent(
        'dragstart',
        e => this.onDragStart(e as DragEvent),
        document,
      )
    }, 100)
  }

  runListeners = (action: 'add' | 'remove'): void => {
    const func = action === 'add' ? 'addEventListener' : 'removeEventListener'

    document[func]('dragover', e => this.onDragOver(e as DragEvent), false)

    document[func]('dragend', e => this.onDragEnd(e as DragEvent), false)

    document
      .querySelectorAll(`.${this.draggableClass}`)
      .forEach((dragEl): void => {
        dragEl.classList[action](this.draggingClass)
      })
  }

  onDragStart = (e: DragEvent): void => {
    this.draggedEl.value = e.target as HTMLElement

    if (!this.draggedEl.value.classList.contains(this.draggableClass))
      return

    this.nextEl.value = this.draggedEl.value?.nextSibling as HTMLElement

    // the element will be moved to new location
    if (e.dataTransfer)
      e.dataTransfer.effectAllowed = 'move'

    this.runListeners('add')

    this.draggedEl.value?.classList.add(...this.ghostClasses.value)
  }

  // Function responsible for sorting
  onDragOver(e: DragEvent) {
    e.preventDefault()

    const target = e.target as HTMLElement

    if (e.dataTransfer)
      e.dataTransfer.dropEffect = 'move'

    const draggedEl = this.draggedEl.value

    if (!draggedEl)
      throw new Error('no draggedEl')

    if (
      target?.classList?.contains(this.draggableClass)
      && target !== draggedEl
    ) {
      const nextEl = target.nextSibling

      const offset = this.getMouseOffset(e)
      const middleY = this.getElementVerticalCenter(target)

      const wr = target.closest(`.${this.wrapClass}`) as HTMLElement | undefined

      wr?.insertBefore(
        draggedEl,
        nextEl && offset.y > middleY ? nextEl : target,
      )
    }
    else if (
      target?.classList?.contains(this.wrapClass)
      && target.children.length === 0
    ) {
      this.wrapEl = target
      target.append(draggedEl)
    }
  }

  onDragEnd = (e: DragEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    this.draggedEl.value?.classList.remove(...this.ghostClasses.value)

    this.onUpdate()

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.runListeners('remove')
  }
}
