type FittyOptions = {
  minSize: number
  maxSize: number
  multiLine: boolean
  observeMutations: false | MutationObserverInit
  lines?: number
  maxCharsPerLine?: number
}

type FittyInstance = {
  element: HTMLElement
  originalStyle: {
    whiteSpace: string
    display: string
    fontSize: string
  }
  active: boolean
  dirty: number
  newbie: boolean
  styleComputed: boolean
  availableWidth: number
  availableHeight: number
  currentWidth: number
  previousFontSize: number
  currentFontSize: number
  minSize: number
  maxSize: number
  multiLine: boolean
  observeMutations: false | MutationObserverInit
  lines?: number
  whiteSpace: string
  display: string
  preStyleTestCompleted: boolean
  observer?: MutationObserver
  maxCharsPerLine?: number
  isVisible: boolean
}

export class Fitty {
  private static DrawState = {
    IDLE: 0,
    DIRTY_CONTENT: 1,
    DIRTY_LAYOUT: 2,
    DIRTY: 3,
  }

  private fitties: FittyInstance[] = []
  private redrawFrame: number | null = null
  private visibilityObserver: IntersectionObserver | null = null

  public observeWindowDelay: number = 100
  private isObservingWindow: boolean = false
  private resizeDebounce: number | null = null

  private debug: boolean = false

  private static defaultOptions: FittyOptions = {
    minSize: 16,
    maxSize: 512,
    multiLine: true,
    lines: 1,
    maxCharsPerLine: 40,
    observeMutations: typeof window !== 'undefined' && 'MutationObserver' in window
      ? {
          subtree: true,
          childList: true,
          characterData: true,
        }
      : false,
  }

  constructor(options: { debug?: boolean } = {}) {
    this.observeWindow = true
    this.debug = options.debug || false
    this.initVisibilityObserver()
  }

  private initVisibilityObserver(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const fitty = this.fitties.find(f => f.element === entry.target)
            if (fitty) {
              fitty.isVisible = entry.isIntersecting
              if (fitty.isVisible && fitty.dirty !== Fitty.DrawState.IDLE) {
                this.requestRedraw()
              }
            }
          })
        },
        { threshold: 0.1 },
      )
    }
  }

  private log(...args: any[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log('[Fitty Debug]', ...args)
    }
  }

  public fit(target: string | HTMLElement, options: Partial<FittyOptions> = {}): void {
    const elements = typeof target === 'string'
      ? Array.from(document.querySelectorAll<HTMLElement>(target))
      : [target]

    const fittyOptions = { ...Fitty.defaultOptions, ...options }

    elements.forEach((element) => {
      const fitty = this.createFitty(element, fittyOptions)
      this.fitties.push(fitty)
      if (this.visibilityObserver) {
        this.visibilityObserver.observe(element)
      }
    })
    this.requestRedraw()
  }

  private createFitty(element: HTMLElement, options: FittyOptions): FittyInstance {
    const f: FittyInstance = {
      element,
      originalStyle: {
        whiteSpace: element.style.whiteSpace,
        display: element.style.display,
        fontSize: element.style.fontSize,
      },
      active: true,
      dirty: Fitty.DrawState.DIRTY,
      newbie: true,
      styleComputed: false,
      availableWidth: 0,
      availableHeight: 0,
      currentWidth: 0,
      previousFontSize: 0,
      currentFontSize: 0,
      minSize: options.minSize,
      maxSize: options.maxSize,
      multiLine: options.multiLine,
      observeMutations: options.observeMutations,
      lines: options.lines,
      whiteSpace: '',
      display: '',
      preStyleTestCompleted: false,
      maxCharsPerLine: options.maxCharsPerLine,
      isVisible: true,
    }

    this.initFitty(f)
    return f
  }

  private initFitty(f: FittyInstance): void {
    this.observeMutations(f)
  }

  private observeMutations(f: FittyInstance): void {
    if (!f.observeMutations)
      return

    f.observer = new MutationObserver(() => {
      f.dirty = Fitty.DrawState.DIRTY_CONTENT
      this.requestRedraw()
    })
    f.observer.observe(f.element, f.observeMutations)
  }

  private requestRedraw(options: { sync: boolean } = { sync: false }): void {
    if (typeof window === 'undefined' || !('requestAnimationFrame' in window))
      return

    if (this.redrawFrame !== null) {
      window.cancelAnimationFrame(this.redrawFrame)
    }

    const redrawFn = () => this.redraw(this.fitties.filter(f => f.dirty && f.active))

    if (options.sync)
      return redrawFn()

    this.redrawFrame = window.requestAnimationFrame(redrawFn)
  }

  private redraw(fitties: FittyInstance[]): void {
    fitties.filter(f => f.isVisible).forEach(f => this.calculateStyles(f))

    fitties.filter(f => f.isVisible).forEach((f) => {
      this.applyStyle(f)
      f.dirty = Fitty.DrawState.IDLE
    })

    fitties.filter(f => f.isVisible).forEach(f => this.dispatchFitEvent(f))
  }

  private calculateStyles(f: FittyInstance): void {
    const parentElement = f.element.parentElement
    if (!parentElement)
      return

    f.availableWidth = parentElement.clientWidth
    f.availableHeight = parentElement.clientHeight

    let low = f.minSize
    let high = f.maxSize
    let bestFit = low

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      f.element.style.fontSize = `${mid}px`
      f.element.style.whiteSpace = f.lines === 1 ? 'nowrap' : (f.multiLine ? 'normal' : 'nowrap')
      f.element.style.display = 'block'

      const lineHeight = this.calculateLineHeight(mid)
      f.element.style.lineHeight = `${lineHeight}`

      const fits = this.checkFit(f, mid, lineHeight)

      if (fits) {
        bestFit = mid
        low = mid + 1
      }
      else {
        high = mid - 1
      }
    }

    f.currentFontSize = bestFit
    this.log('Final font size:', f.currentFontSize)
  }

  private calculateLineHeight(fontSize: number): number {
    if (fontSize < 50) {
      return 1.4 - (0.3 * (fontSize - 16) / (50 - 16))
    }
    else if (fontSize >= 200) {
      return 0.85
    }
    else {
      return 1.1 - (0.25 * (fontSize - 50) / (200 - 50))
    }
  }

  private checkFit(f: FittyInstance, fontSize: number, lineHeight: number): boolean {
    const computedLineHeight = fontSize * lineHeight
    const maxLines = f.lines || 1

    if (maxLines === 1) {
      return f.element.scrollWidth <= f.availableWidth
    }
    else {
      const maxHeight = maxLines * computedLineHeight
      if (f.element.scrollHeight > maxHeight) {
        return false
      }
    }

    if (f.maxCharsPerLine && !this.respectsMaxCharsPerLine(f.element, f.maxCharsPerLine)) {
      return false
    }

    return f.element.scrollWidth <= f.availableWidth
  }

  private respectsMaxCharsPerLine(element: HTMLElement, maxChars: number): boolean {
    const words = element.textContent?.split(/\s+/) || []
    let currentLineLength = 0

    for (const word of words) {
      if (currentLineLength + word.length > maxChars) {
        if (currentLineLength === 0) {
          return false
        }
        currentLineLength = word.length
      }
      else {
        currentLineLength += (currentLineLength > 0 ? 1 : 0) + word.length
      }
    }

    return true
  }

  private applyStyle(f: FittyInstance): void {
    f.element.style.whiteSpace = f.multiLine ? 'normal' : 'nowrap'
    f.element.style.display = 'block'
    f.element.style.fontSize = `${f.currentFontSize}px`
    const lineHeight = this.calculateLineHeight(f.currentFontSize)
    f.element.style.lineHeight = `${lineHeight}`

    const firstChild = f.element.firstElementChild as HTMLElement
    if (firstChild) {
      firstChild.style.wordWrap = 'normal'
    }
  }

  private dispatchFitEvent(f: FittyInstance): void {
    f.element.dispatchEvent(new CustomEvent('fit', {
      detail: {
        oldValue: Number.parseFloat(f.originalStyle.fontSize),
        newValue: f.currentFontSize,
        scaleFactor: f.currentFontSize / Number.parseFloat(f.originalStyle.fontSize),
      },
    }))
  }

  public fitAll(): void {
    this.fitties.forEach(f => f.dirty = Fitty.DrawState.DIRTY)
    this.requestRedraw()
  }

  private onWindowResized = (): void => {
    if (typeof window === 'undefined')
      return

    if (this.resizeDebounce !== null) {
      window.clearTimeout(this.resizeDebounce)
    }
    this.resizeDebounce = window.setTimeout(() => {
      this.fitties.forEach(f => f.dirty = Fitty.DrawState.DIRTY_LAYOUT)
      this.requestRedraw()
    }, this.observeWindowDelay)
  }

  get observeWindow(): boolean {
    return this.isObservingWindow
  }

  set observeWindow(enabled: boolean) {
    if (typeof window === 'undefined' || this.isObservingWindow === enabled)
      return

    this.isObservingWindow = enabled
    const method = enabled ? 'addEventListener' : 'removeEventListener';
    ['resize', 'orientationchange'].forEach((event) => {
      window[method](event, this.onWindowResized)
    })
  }

  public destroy(): void {
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect()
    }
    this.fitties.forEach((fitty) => {
      if (fitty.observer) {
        fitty.observer.disconnect()
      }
    })
    this.fitties = []
    this.observeWindow = false
  }
}
