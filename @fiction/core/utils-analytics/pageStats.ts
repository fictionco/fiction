import { log } from '../plugin-log'
import { localRef, vue } from '../utils'
import { ActivityTrigger, onBrowserEvent } from './tracking'

abstract class PageStat {
  key: string
  protected resolutionMs = 1000
  protected clear: (() => void)[] = []
  log = log.contextLogger(this.constructor.name)
  constructor(settings: PageStatSettings) {
    this.key = settings.key
  }

  public start(lifecycle: 'page' | 'session' = 'page'): void {
    this.clear.forEach(cb => cb())
    this.clear = []
    this.reset()
    if (lifecycle === 'session') {
      this.log.info('reset persistent data', { data: { lifecycle } })
      this.resetPersistent()
    }
    this.watch()
  }

  protected abstract reset(): void
  protected resetPersistent(): void {}
  protected abstract watch(): void
}

class MouseMoveHandler extends PageStat {
  private trackNew = true
  public totalMoves = 0
  constructor(settings: PageStatSettings) {
    super(settings)
  }

  watch(): void {
    const remover = onBrowserEvent('mousemove', () => {
      if (this.trackNew) {
        this.trackNew = false
        this.totalMoves += 1

        setTimeout(() => {
          this.trackNew = true
        }, this.resolutionMs)
      }
    })
    this.clear.push(remover)
  }

  override reset(): void {
    this.totalMoves = 0
  }
}

class KeyPressHandler extends PageStat {
  public lastKey?: KeyboardEvent
  public lastKeyTime?: number
  public totalKeyPresses = 0
  constructor(settings: PageStatSettings) {
    super(settings)
  }

  watch(): void {
    const remover = onBrowserEvent('keypress', (event: KeyboardEvent) => {
      this.totalKeyPresses += 1
      this.lastKey = event
      this.lastKeyTime = +Date.now()
    })
    this.clear.push(remover)
  }

  override reset(): void {
    this.totalKeyPresses = 0
    this.lastKey = undefined
    this.lastKeyTime = undefined
  }
}

class ScrollHandler extends PageStat {
  scrollDepth = 0
  totalScrolls = 0
  trackNewScroll = true
  trackPageDepth = true
  constructor(settings: PageStatSettings) {
    super(settings)
  }

  getScrollDepth(): number {
    const winScroll
      = document.body.scrollTop || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const viewportHeight = document.documentElement.clientHeight

    if (scrollHeight === 0)
      return 0

    const scrolled = ((viewportHeight + winScroll) / scrollHeight) * 100

    return Math.min(Math.round(scrolled), 100)
  }

  override reset(): void {
    this.scrollDepth = this.getScrollDepth()
    this.totalScrolls = 0
  }

  watch(): void {
    // if no page height, wait a bit
    if (this.scrollDepth === 0) {
      setTimeout(() => this.start(), 500)
    }
    else {
      this.trackNewScroll = true
      this.trackPageDepth = true

      const r = onBrowserEvent('scroll', () => {
        if (this.trackPageDepth) {
          this.trackPageDepth = false

          setTimeout(() => {
            this.trackPageDepth = true

            const currentDepth = this.getScrollDepth()

            if (currentDepth > this.scrollDepth)
              this.scrollDepth = currentDepth
          }, 300)
        }

        if (this.trackNewScroll) {
          this.trackNewScroll = false
          this.totalScrolls += 1
          setTimeout(() => {
            this.trackNewScroll = true
          }, this.resolutionMs)
        }
      })
      this.clear = [r]
    }
  }
}

class ClickHandler extends PageStat {
  public clickTotal = 0
  public touchTotal = 0
  public lastClick?: MouseEvent
  public lastTouch?: TouchEvent
  public lastClickTime?: number
  public lastTouchTime?: number
  private keyCpl = `KTotalClk-${this.key}`
  private compiledTotalClicks = localRef<number>({ key: this.keyCpl, def: 0, lifecycle: 'session' })

  protected reset(): void {
    this.clickTotal = 0
    this.touchTotal = 0
    this.lastClick = undefined
    this.lastClickTime = undefined
    this.lastTouch = undefined
    this.lastTouchTime = undefined
    this.compiledTotalClicks.value = 0 // Reset the persisted total clicks
  }

  constructor(settings: PageStatSettings) {
    super(settings)
  }

  private addToTotalSessionClicks(amount: number): void {
    this.compiledTotalClicks.value += amount
  }

  protected watch(): void {
    const r = onBrowserEvent('click', (event: MouseEvent) => {
      this.clickTotal += 1
      this.lastClick = event
      this.lastClickTime = Date.now()
      this.addToTotalSessionClicks(1)
    })
    const r2 = onBrowserEvent('touchstart', (event: TouchEvent) => {
      this.touchTotal += 1
      this.lastTouch = event
      this.lastTouchTime = Date.now()
      this.addToTotalSessionClicks(1)
    })

    this.clear = [r, r2]
  }
}
class DurationHandler extends PageStat {
  lastInteraction = +Date.now()
  pageSeconds = vue.ref(0)
  activeIfInteractionWithinMS = 12_000
  totalSecondsActive = localRef({
    key: `KTotalActive-${this.key}`,
    def: 0,
    lifecycle: 'session',
  })

  constructor(settings: PageStatSettings) {
    super(settings)
  }

  override resetPersistent(): void {
    this.totalSecondsActive.value = 0
  }

  reset(): void {
    this.lastInteraction = +Date.now()
    this.pageSeconds.value = 0
  }

  watch(): void {
    const timer = setInterval(() => {
      if (
        this.lastInteraction
        && +Date.now() - this.lastInteraction < this.activeIfInteractionWithinMS
      ) {
        this.totalSecondsActive.value++
        this.pageSeconds.value++
      }
    }, 1000)

    this.clear.push(() => clearInterval(timer))
    const activityTracker = new ActivityTrigger({
      onEngage: () => {
        this.lastInteraction = +Date.now()
      },
    })

    this.clear.push(() => activityTracker.reset())
  }

  totalActiveDuration(): number {
    return this.totalSecondsActive.value
  }

  pageDuration(): number {
    return this.pageSeconds.value
  }
}
interface PageStatSettings { key: string }
export class KaptionPageStats {
  key: string
  map: {
    clicks: ClickHandler
    duration: DurationHandler
    keypress: KeyPressHandler
    move: MouseMoveHandler
    scrolls: ScrollHandler
  }

  constructor(settings: PageStatSettings) {
    this.key = settings.key
    this.map = {
      clicks: new ClickHandler(settings),
      scrolls: new ScrollHandler(settings),
      duration: new DurationHandler(settings),
      move: new MouseMoveHandler(settings),
      keypress: new KeyPressHandler(settings),
    }
  }

  start(opts: { lifecycle?: 'page' | 'session' } = {}): void {
    const { lifecycle = 'page' } = opts
    for (const stat of Object.values(this.map))
      stat.start(lifecycle)

    log.debug('PageStats', 'initialized')
  }

  getPageStats() {
    return {
      engageDuration: this.map.duration.pageDuration(),
      scrollDepth: this.map.scrolls.scrollDepth,
      scrollTotal: this.map.scrolls.totalScrolls,
      moveTotal: this.map.move.totalMoves,
      clickTotal: this.map.clicks.clickTotal,
      touchTotal: this.map.clicks.touchTotal,
      keypressTotal: this.map.keypress.totalKeyPresses,
    }
  }

  resetAll() {
    this.start({ lifecycle: 'session' })
  }
}
