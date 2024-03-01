import { onBrowserEvent, vue } from '@factor/api'
import type { FactorDashboard } from '..'

export class DragDropGrid {
  factorDashboard: FactorDashboard
  reset?: () => void
  throttleDrag = vue.ref(false)
  dragEl = vue.ref<HTMLElement>()
  nextEl = vue.ref<HTMLElement>()
  ghostClasses = vue.ref<string[]>(['ring-4', 'ring-primary-500'])

  constructor(settings: { factorDashboard: FactorDashboard }) {
    this.factorDashboard = settings.factorDashboard
  }

  getSortableGridEl = (): HTMLElement => {
    const sel = `#${this.factorDashboard.domSelectors.grid}`
    const el = document.querySelector(sel) as HTMLElement | undefined
    if (!el)
      throw new Error('no drag drop grid')
    return el
  }

  enable(): void {
    if (this.reset)
      this.reset()

    // allow dom transforms to happen
    setTimeout(() => {
      const el = this.getSortableGridEl()

      this.reset = onBrowserEvent('dragstart', e => this.onDragStart(e), el)
    }, 100)
  }

  onDragOver = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    if (this.throttleDrag.value)
      return

    setTimeout(() => {
      this.throttleDrag.value = false
    }, 300)

    this.throttleDrag.value = true

    if (e.dataTransfer)
      e.dataTransfer.dropEffect = 'move'

    const target = e.target as HTMLElement

    const { top, bottom, left, right } = target.getBoundingClientRect()

    const next
      = (e.clientY - top) / (bottom - top) > 0.8
      || (e.clientX - left) / (right - left) > 0.7

    if (this.dragEl.value && target?.classList?.contains('drop-target')) {
      const beforeEl = (next && target.nextSibling) || target

      this.getSortableGridEl().insertBefore(this.dragEl.value, beforeEl)
    }
  }

  onDragEnd = (e: DragEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    this.dragEl.value?.classList.remove(...this.ghostClasses.value)

    this.factorDashboard.updateWidgetLayout()

    this.runListeners('remove')
  }

  runListeners = (action: 'add' | 'remove'): void => {
    const func = action === 'add' ? 'addEventListener' : 'removeEventListener'
    const sel = `.${this.factorDashboard.domSelectors.widget}`
    document.querySelectorAll(sel).forEach((el): void => {
      el.classList[action]('drag')
      el[func]('dragover', e => this.onDragOver(e as DragEvent), false)
      el[func]('dragend', e => this.onDragEnd(e as DragEvent), false)
    })
  }

  onDragStart = (e: DragEvent): void => {
    this.dragEl.value = e.target as HTMLElement

    this.nextEl.value = this.dragEl.value?.nextSibling as HTMLElement

    if (e.dataTransfer)
      e.dataTransfer.effectAllowed = 'move'

    this.runListeners('add')

    this.dragEl.value.classList.add(...this.ghostClasses.value)
  }
}
