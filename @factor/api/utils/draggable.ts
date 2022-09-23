import { Obj } from "../obj"
import { onBrowserEvent } from "../utils-analytics/tracking"
import { vue } from "./libraries"

export type DraggableListSettings = {
  wrapClass: string
  draggableClass: string
  placeholderClass: string
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
  draggingClass = "dragging"
  onUpdate = this.settings.onUpdate
  dragIndex = -1
  wrapEl?: HTMLElement
  parentEl?: HTMLElement

  constructor(settings: DraggableListSettings) {
    super("draggable", settings)

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
    if (el) return
    const styleSheet = document.createElement("style")
    styleSheet.setAttribute("type", "text/css")
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
    if (this.reset) this.reset()

    // allow dom transforms to happen
    setTimeout(() => {
      this.reset = onBrowserEvent(
        "dragstart",
        (e) => this.onDragStart(e as DragEvent),
        document,
      )
    }, 100)
  }

  runListeners = (action: "add" | "remove"): void => {
    const func = action == "add" ? "addEventListener" : "removeEventListener"

    document[func]("dragover", (e) => this.onDragOver(e as DragEvent), false)
    document[func]("dragover", (e) => this.onDragLeave(e as DragEvent), false)
    document[func]("dragend", (e) => this.onDragEnd(e as DragEvent), false)

    this.wrapEl
      ?.querySelectorAll(`.${this.draggableClass}`)
      .forEach((dragEl): void => {
        dragEl.classList[action](this.draggingClass)
      })

    if (this.hideOnDragClass) {
      this.wrapEl
        ?.querySelectorAll(`.${this.hideOnDragClass}`)
        .forEach((el) => {
          const elem = el as HTMLElement
          elem.style.opacity = action == "add" ? ".7" : "1"
        })
    }
  }

  onDragStart = (e: DragEvent): void => {
    this.wrapEl = document.querySelector(`.${this.wrapClass}`) as HTMLElement

    this.draggedEl.value = e.target as HTMLElement

    if (!this.draggedEl.value.classList.contains(this.draggableClass)) return

    this.nextEl.value = this.draggedEl.value?.nextSibling as HTMLElement

    // the element will be moved to new location
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
    }

    this.runListeners("add")

    this.draggedEl.value?.classList.add(...this.ghostClasses.value)
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault()

    const target = e.target as HTMLElement

    if (
      target?.classList?.contains(this.wrapClass) &&
      !target.querySelector(`.${this.draggableClass}`)
    ) {
      this.wrapEl = target

      const pl = this.wrapEl.querySelector(`.${this.placeholderClass}`) as
        | HTMLElement
        | undefined

      if (pl) {
        pl.style.display = "block"
      }
    }
  }

  throttle() {
    if (this.throttleDrag.value) {
      return true
    } else {
      this.throttleDrag.value = true
      setTimeout(() => {
        this.throttleDrag.value = false
      }, 50)

      return false
    }
  }

  // Function responsible for sorting
  onDragOver(e: DragEvent) {
    e.preventDefault()

    const target = e.target as HTMLElement

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }

    const draggedEl = this.draggedEl.value

    if (!draggedEl) throw new Error("no draggedEl")

    if (
      target?.classList?.contains(this.draggableClass) &&
      target != draggedEl
    ) {
      if (this.throttle()) return

      const nextEl = target.nextSibling

      const offset = this.getMouseOffset(e)
      const middleY = this.getElementVerticalCenter(target)

      const wr = target.closest(`.${this.wrapClass}`) as HTMLElement | undefined

      wr?.insertBefore(
        draggedEl,
        nextEl && offset.y > middleY ? nextEl : target,
      )
    } else if (
      target?.classList?.contains(this.wrapClass) &&
      target.children.length <= 1
    ) {
      this.wrapEl = target

      const pl = this.wrapEl.querySelector(`.${this.placeholderClass}`) as
        | HTMLElement
        | undefined

      if (pl) {
        pl.style.display = "none"
      }

      if (!target.querySelector(`.${this.draggableClass}`)) {
        target.append(draggedEl)
      }
    }
  }

  onDragEnd = (e: DragEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    this.draggedEl.value?.classList.remove(...this.ghostClasses.value)

    this.onUpdate()

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.runListeners("remove")
  }
}
