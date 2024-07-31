type FittyOptions = {
  minSize: number
  maxSize: number
  multiLine: boolean
  observeMutations: false | MutationObserverInit
  lines?: number
  maxCharsPerLine?: number // New option
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
  maxCharsPerLine: number
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

  public observeWindowDelay: number = 100
  private isObservingWindow: boolean = false
  private resizeDebounce: number | null = null

  private static defaultOptions: FittyOptions = {
    minSize: 16,
    maxSize: 512,
    multiLine: true,
    maxCharsPerLine: 40, // Default value for maxCharsPerLine
    observeMutations: typeof window !== 'undefined' && 'MutationObserver' in window
      ? {
          subtree: true,
          childList: true,
          characterData: true,
        }
      : false,
  }

  constructor() {
    this.observeWindow = true
  }

  public fit(target: string | HTMLElement, options: Partial<FittyOptions> = {}): void {
    const elements = typeof target === 'string'
      ? Array.from(document.querySelectorAll<HTMLElement>(target))
      : [target as HTMLElement]

    const fittyOptions = { ...Fitty.defaultOptions, ...options }

    elements.forEach((element) => {
      const fitty = this.createFitty(element, fittyOptions)
      this.fitties.push(fitty)
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
      maxCharsPerLine: options.maxCharsPerLine || Fitty.defaultOptions.maxCharsPerLine || 40,
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
    fitties
      .filter(f => !f.styleComputed)
      .forEach((f) => {
        f.styleComputed = this.computeStyle(f)
      })

    fitties.filter(f => this.shouldPreStyle(f)).forEach(f => this.applyStyle(f))

    const fittiesToRedraw = fitties.filter(f => this.shouldRedraw(f))

    fittiesToRedraw.forEach(f => this.calculateStyles(f))

    fittiesToRedraw.forEach((f) => {
      this.applyStyle(f)
      f.dirty = Fitty.DrawState.IDLE
    })

    fittiesToRedraw.forEach(f => this.dispatchFitEvent(f))
  }

  private computeStyle(f: FittyInstance): boolean {
    if (typeof window === 'undefined')
      return false

    const style = window.getComputedStyle(f.element, null)
    f.currentFontSize = Number.parseFloat(style.getPropertyValue('font-size'))
    f.display = style.getPropertyValue('display')
    f.whiteSpace = style.getPropertyValue('white-space')
    return true
  }

  private shouldPreStyle(f: FittyInstance): boolean {
    if (f.preStyleTestCompleted)
      return false

    let preStyle = false

    if (!/inline-/.test(f.display)) {
      preStyle = true
      f.display = 'inline-block'
    }

    // Set white-space to nowrap only if it's not multiline
    if (!f.multiLine && !f.lines && f.whiteSpace !== 'nowrap') {
      preStyle = true
      f.whiteSpace = 'nowrap'
    }

    f.preStyleTestCompleted = true
    return preStyle
  }

  private shouldRedraw(f: FittyInstance): boolean {
    return f.dirty !== Fitty.DrawState.DIRTY_LAYOUT
      || (f.dirty === Fitty.DrawState.DIRTY_LAYOUT
      && f.element.parentElement!.clientWidth !== f.availableWidth)
  }

  private calculateStyles(f: FittyInstance): void {
    const parentElement = f.element.parentElement
    if (!parentElement)
      return

    f.availableWidth = parentElement.clientWidth
    f.currentWidth = f.element.scrollWidth
    f.previousFontSize = f.currentFontSize

    const targetLines = f.lines ? f.lines + 1 : (f.multiLine ? 0 : 1)
    const availableHeight = parentElement.clientHeight

    let low = f.minSize
    let high = f.maxSize

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      f.element.style.fontSize = `${mid}px`

      // Calculate line height based on font size
      const lineHeight = this.calculateLineHeight(mid)
      f.element.style.lineHeight = lineHeight.toString()

      f.element.style.whiteSpace = f.multiLine || f.lines ? 'normal' : 'nowrap'

      const computedLineHeight = Number.parseFloat(getComputedStyle(f.element).lineHeight)
      const textHeight = targetLines ? targetLines * computedLineHeight : availableHeight

      // Check if the text fits within the available width and respects maxCharsPerLine
      const fitsWidth = f.element.scrollWidth <= f.availableWidth
      const fitsMaxChars = this.respectsMaxCharsPerLine(f.element, f.maxCharsPerLine)

      if (f.element.scrollHeight <= textHeight && fitsWidth && fitsMaxChars) {
        if (f.element.scrollHeight < textHeight * 0.9) { // Allow some tolerance
          low = mid + 1
        }
        else {
          break // We've found a good fit
        }
      }
      else {
        high = mid - 1
      }
    }

    f.currentFontSize = Math.min(high, f.maxSize)
    f.element.style.fontSize = `${f.currentFontSize}px`

    // Set final line height
    const finalLineHeight = this.calculateLineHeight(f.currentFontSize)
    f.element.style.lineHeight = finalLineHeight.toString()

    f.whiteSpace = f.multiLine || f.lines ? 'normal' : 'nowrap'
  }

  private calculateLineHeight(fontSize: number): number {
    if (fontSize > 50) {
      return 1
    }
    else {
      // Linear interpolation between 1.4 (at 16px) and 1.2 (at 50px)
      return 1.4 - (0.2 * (fontSize - 16) / (50 - 16))
    }
  }

  private respectsMaxCharsPerLine(element: HTMLElement, maxChars: number): boolean {
    const words = element.textContent?.split(/\s+/) || []
    let currentLineLength = 0

    for (const word of words) {
      if (currentLineLength + word.length > maxChars) {
        if (currentLineLength === 0) {
          // If a single word is longer than maxChars, we can't fit it
          return false
        }
        // Start a new line
        currentLineLength = word.length
      }
      else {
        currentLineLength += (currentLineLength > 0 ? 1 : 0) + word.length
      }
    }

    return true
  }

  private applyStyle(f: FittyInstance): void {
    f.element.style.whiteSpace = f.whiteSpace
    f.element.style.display = f.display
    f.element.style.fontSize = `${f.currentFontSize}px`
  }

  private dispatchFitEvent(f: FittyInstance): void {
    f.element.dispatchEvent(new CustomEvent('fit', {
      detail: {
        oldValue: f.previousFontSize,
        newValue: f.currentFontSize,
        scaleFactor: f.currentFontSize / f.previousFontSize,
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
}
