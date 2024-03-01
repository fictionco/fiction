import type { ClickOffsetPosition } from '@factor/api'
import { onEvent } from '@factor/api'
import { log } from '@factor/api/plugin-log'
import { sendNavigateMessage } from '../../utils/frame'
import type { ClickEvent } from '../types'
import type { HeatmapDataPoint } from './heatmapRender'
import { drawHeatmap } from './heatmapRender'

class KaptionHeatmapFrame {
  log = log.contextLogger(this.constructor.name)
  interval?: NodeJS.Timeout
  loops = 0
  constructor() {
    onEvent('setHeatmap', (events: ClickEvent[]) => {
      this.generateHeatmap(events)
    })
  }

  pageOffset(
    el: HTMLElement,
    position?: ClickOffsetPosition,
  ): { x: number, y: number } | undefined {
    const { xPercent = 0, yPercent = 0 } = position || {}
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const pageTop = rect.top + scrollTop
    const pageLeft = rect.left + scrollLeft

    const x = xPercent * rect.width + pageLeft
    const y = yPercent * rect.height + pageTop

    return { y, x }
  }

  generateHeatmap(events: ClickEvent[]) {
    const body = document.querySelector('body')

    if (!body)
      throw new Error('body not found')

    // remove if heatmap sent again
    document.querySelector('#heatmapCanvas')?.remove()

    body.classList.add('applied-heatmap')

    const heatmapCanvas = document.createElement('canvas')

    heatmapCanvas.id = 'heatmapCanvas'
    heatmapCanvas.style.position = 'absolute'
    heatmapCanvas.style.top = '0'
    heatmapCanvas.style.left = '0'
    heatmapCanvas.style.background = 'rgba(0,0,0,.2)'
    heatmapCanvas.style.pointerEvents = 'none'
    document.body.append(heatmapCanvas)

    const d: HeatmapDataPoint[] = []
    events.forEach((click) => {
      if (!click.selector)
        return
      const el = document.querySelector(click.selector) as HTMLElement
      if (!el)
        return

      let position: ClickOffsetPosition | undefined

      const meta
        = click.meta && typeof click.meta === 'string'
          ? (JSON.parse(click.meta) as Record<string, any>)
          : click.meta
      if (meta && typeof meta !== 'string' && meta.position)
        position = meta.position as ClickOffsetPosition

      const coordinates = this.pageOffset(el, position)

      if (coordinates) {
        d.push({ x: coordinates.x, y: coordinates.y })
      }
      else {
        this.log.warn(
          `Could not find coordinates for element ${click.selector}`,
        )
      }
    })
    // needed for css
    body.classList.add('applied-heatmap')

    if (!body.classList.contains('heatmap-active')) {
      this.log.info(`[CHILD]: Listen to Click Events`)
      document
        .querySelectorAll<HTMLElement>('a[href]')
        .forEach((el: HTMLElement) => {
          // disabled click events
          el.addEventListener('click', (event: MouseEvent) => {
            sendNavigateMessage(el, event)
          })
        })

      body.classList.add('heatmap-active')
    }

    const ctx = heatmapCanvas.getContext('2d')

    if (!ctx)
      throw new Error('no 2d context')

    const renderWidth = document.documentElement.scrollWidth
    const renderHeight = document.documentElement.scrollHeight

    ctx.canvas.width = renderWidth
    ctx.canvas.height = renderHeight

    if (this.interval)
      clearInterval(this.interval)

    this.interval = setInterval(() => {
      const currentWidth = document.documentElement.scrollWidth
      const currentHeight = document.documentElement.scrollHeight

      if (
        currentHeight !== renderHeight
        || currentWidth !== renderWidth
        || this.loops >= 15
      ) {
        this.log.info('render heatmap', {
          data: {
            currentHeight,
            renderHeight,
            currentWidth,
            renderWidth,
          },
        })
        this.generateHeatmap(events)
        this.loops = 0
      }

      this.loops++
    }, 2000)

    // render points
    drawHeatmap(heatmapCanvas, d)
  }
}

export function setup() {
  new KaptionHeatmapFrame()
}
