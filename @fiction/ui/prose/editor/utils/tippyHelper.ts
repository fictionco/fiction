import type { Editor } from '@tiptap/core'
import { posToDOMRect } from '@tiptap/core'
import type { EditorView } from '@tiptap/pm/view'

import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'

export interface TippyInitOptions {
  editor: Editor
  validate?: (url: string) => boolean
}

class Tooltip {
  private tippyInstance?: Instance
  private preventHide: boolean = false
  private tippyWrapper: HTMLDivElement
  private editor: Editor
  private view: EditorView

  constructor(options: TippyInitOptions) {
    this.editor = options.editor
    this.view = this.editor.view
    this.tippyWrapper = document.createElement('div')
    this.tippyWrapper.addEventListener('mousedown', this.mousedownHandler, {
      capture: true,
    })
    this.view.dom.addEventListener('dragstart', this.dragstartHandler)
    this.editor.on('blur', this.blurHandler)
  }

  init() {
    this.tippyWrapper.innerHTML = ''

    return { tippyModal: this.tippyWrapper, tippyInstance: this.tippyInstance }
  }

  show() {
    this.tippyInstance?.show()
    return true
  }

  hide() {
    setTimeout(() => this.tippyInstance?.hide())
    return false
  }

  private mousedownHandler = () => {
    this.preventHide = true
  }

  private dragstartHandler = () => {
    this.hide()
  }

  private blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false
      return
    }
    if (
      event?.relatedTarget
      && this.tippyWrapper.parentNode?.contains(event.relatedTarget as Node)
    ) {
      return
    }

    this.hide()
  }

  private tippyBlurHandler = (event: FocusEvent) => {
    this.blurHandler({ event })
  }

  private createTooltip() {
    if (!this.editor || !this.editor.options)
      return
    const { element: editorElement } = this.editor.options
    const editorIsAttached = !!editorElement.parentElement

    if (this.tippyInstance || !editorIsAttached)
      return

    this.tippyInstance = tippy(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.tippyWrapper,
      interactive: true,
      trigger: 'manual',
      placement: 'bottom',
      hideOnClick: true,
      onClickOutside: (instance, event) => {
        this.hide()
      },
      onAfterUpdate: (instance, partialProps) => {
        this.show()
      },
    })

    if (this.tippyInstance.popper.firstChild) {
      (this.tippyInstance.popper.firstChild as HTMLElement).addEventListener(
        'blur',
        this.tippyBlurHandler,
      )
    }
  }

  update(view: EditorView, option: any = {}) {
    this.createTooltip()

    option.arrow = option?.arrow ?? false

    if (this.tippyInstance) {
      this.tippyInstance.setProps({
        ...option,
        getReferenceClientRect: () => {
          const pos = view.state.selection.from
          // width: 0 is a hack to prevent tippy display in the wrong position
          return { ...posToDOMRect(view, pos, pos), width: 0 }
        },
      })
    }

    return {}
  }

  destroyTooltip() {
    if (this.tippyInstance) {
      this.tippyInstance.destroy()
      this.tippyInstance = undefined
      this.tippyWrapper.removeEventListener('mousedown', this.mousedownHandler, {
        capture: true,
      })
      this.view.dom.removeEventListener('dragstart', this.dragstartHandler)
      this.editor.off('blur', this.blurHandler)
    }
  }
}

export default Tooltip
