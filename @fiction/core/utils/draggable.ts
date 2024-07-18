import { Obj } from '../obj.js'
import { onBrowserEvent } from './eventBrowser.js'
import { vue } from './libraries.js'

export type DraggableListSettings = {
  wrapClass: string
  draggableClass: string
  placeholderClass?: string
  hideOnDragClass?: string
  ghostClasses: string[]
  onUpdate: () => void
}

export class DraggableList extends Obj<DraggableListSettings> {
  reset?: () => void
  throttleDrag = vue.ref(false)
  draggedEl = vue.ref<HTMLElement>()
  nextEl = vue.ref<HTMLElement>()
  ghostClasses = vue.ref<string[]>(this.settings.ghostClasses || [])
  wrapClass = this.settings.wrapClass
  draggableClass = this.settings.draggableClass
  placeholderClass = this.settings.placeholderClass
  hideOnDragClass = this.settings.hideOnDragClass
  draggingClass = 'dragging'
  onUpdate = this.settings.onUpdate
  dragIndex = -1
  wrapEls?: HTMLElement[]
  parentEl?: HTMLElement

  constructor(settings: DraggableListSettings) {
    super('DraggableList', settings)
  }

  init() {
    this.wrapEls = [
      ...document.querySelectorAll(`.${this.wrapClass}`),
    ] as HTMLElement[]
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

  enable(): void {
    if (this.reset)
      this.reset()

    // allow dom transforms to happen
    setTimeout(() => {
      this.reset = onBrowserEvent(
        'dragstart',
        e => this.onDragStart(e),
        document,
      )
    }, 100)
  }

  runListeners = (action: 'add' | 'remove'): void => {
    const func = action === 'add' ? 'addEventListener' : 'removeEventListener'

    document[func]('dragover', e => this.onDragOver(e as DragEvent), false)
    document[func]('dragend', e => this.onDragEnd(e as DragEvent), false)

    this.wrapEls?.forEach((wrapEl) => {
      wrapEl
        .querySelectorAll(`.${this.draggableClass}`)
        .forEach((dragEl): void => {
          dragEl.classList[action](this.draggingClass)
        })

      wrapEl.querySelectorAll(`.${this.hideOnDragClass}`).forEach((el) => {
        const elem = el as HTMLElement
        elem.style.opacity = action === 'add' ? '.7' : '1'
      })
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

  throttle() {
    if (this.throttleDrag.value) {
      return true
    }
    else {
      this.throttleDrag.value = true
      setTimeout(() => {
        this.throttleDrag.value = false
      }, 50)

      return false
    }
  }

  scrollIntoView(el: HTMLElement) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
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

    if (this.throttle())
      return

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
      this.scrollIntoView(draggedEl)
    }
    else if (target?.classList?.contains(this.wrapClass)) {
      if (this.placeholderClass) {
        const pl = target.querySelector(`.${this.placeholderClass}`) as
          | HTMLElement
          | undefined

        if (pl)
          pl.style.display = 'none'
      }

      if (!target.querySelector(`.${this.draggableClass}`)) {
        target.append(draggedEl)

        this.scrollIntoView(draggedEl)
      }
    }
  }

  onDragEnd = (e: DragEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    this.draggedEl.value?.classList.remove(...this.ghostClasses.value)

    this.onUpdate()
    this.runListeners('remove')
  }
}
