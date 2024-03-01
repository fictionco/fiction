import { elementId, onEvent } from '@kaption/browser-utils'
import './serverStyle.less'
import DOMPurify from 'dompurify'
import type { FrameChangeElement } from '@kaption/engine'
import { logger } from '@factor/api/logger'
import { sendNavigateMessage } from '../utilss'

/**
 * INITIALIZE GLOBALS
 */
declare global {
  interface Window {
    kaptionOriginals?: Record<
      string,
      { hash: string, selector: string, html: string }
    >
  }
}
window.kaptionOriginals = {}

/**
 *
 * PAGE EDITING
 *
 */
export function makePageEditable(opts?: {
  onChange: (change: FrameChangeElement) => void
}): void {
  const { onChange } = opts ?? {}

  window.kaptionOriginals = {}

  const body = document.querySelector('body')

  if (!body)
    throw new Error('body not found')

  if (body.classList.contains('kaption-edit'))
    return

  logger.log({ level: 'info', description: 'making page editable' })

  body.classList.add('kaption-edit')

  const bounderHover = document.createElement('div')
  bounderHover.className = 'bounder bounder-hover'
  bounderHover.innerHTML
    = '<div class="bounder-text bounder-text-hover"><div class="selector"></div></div>'

  const bounderEdit = document.createElement('div')
  bounderEdit.className = 'bounder bounder-edit'
  bounderEdit.innerHTML = `<div class="bounder-text bounder-text-edit">
      <div class="selector"></div>
        <div class="done-editing bounder-text-button">
      </div>
    </div>`

  body.append(bounderHover)
  body.append(bounderEdit)

  let __currentlyEditingEl: HTMLElement

  const doneEditingEl = bounderEdit.querySelector('.done-editing')

  const resetEl = (el: HTMLElement): void => {
    el.style.top = ''
    el.style.left = ''
    el.style.width = ''
    el.style.height = ''
    el.style.display = 'none'
    el.classList.remove('edited')
  }

  const resetBounders = (): void => {
    resetEl(bounderHover)
    resetEl(bounderEdit)
  }

  const getOriginalHtml = (el: HTMLElement): string => {
    const sel = el.dataset.selector || ''
    const { html: originalHtml = '' } = window.kaptionOriginals?.[sel] ?? {}
    return originalHtml
  }
  const setBounderStyle = (
    mode: 'mouseover' | 'keyup' | 'click',
    target: HTMLElement,
    el: HTMLElement,
  ): void => {
    const selector = target.dataset.selector
    if (!selector)
      return

    if (mode === 'click') {
      resetBounders()

      __currentlyEditingEl = target
    }
    const originalHtml = getOriginalHtml(target)
    const newHtml = target.innerHTML.toString()

    if (originalHtml !== newHtml) {
      if (doneEditingEl)
        doneEditingEl.innerHTML = '+ Add Change'
      bounderEdit.classList.add('edited')
    }
    else {
      if (doneEditingEl)
        doneEditingEl.innerHTML = 'No Changes'
      bounderEdit.classList.remove('edited')
    }

    const { width, height, x, y } = target.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.display = 'block'
    el.style.width = `${width + 10}px`
    el.style.height = `${height + 30}px`
    el.style.left = `${x - 5}px`
    el.style.top = `${y + window.scrollY - 5}px`
    el.dataset.hash = target.dataset.hash
    el.dataset.selector = selector
    const selectorText = el.querySelector('.selector')

    if (selectorText)
      selectorText.innerHTML = `Edit: ${selector}` ?? ''
  }

  const sendChangeEvent = (el: HTMLElement): void => {
    const html = DOMPurify.sanitize(el.innerHTML.toString())

    const { hash, selector } = elementId(el)

    const originalHtml = getOriginalHtml(el)

    // if content is unchanged
    if (originalHtml && html === originalHtml)
      return

    const lp = location.pathname
    const pathname = lp === '/' ? lp : lp.replace(/\/$/, '')

    const change: FrameChangeElement = {
      hash,
      selector,
      html,
      pathname,
      status: 'success',
      timestamp: +Date.now(),
    }

    if (onChange) {
      onChange(change)
      logger.log({
        level: 'info',
        description: 'sent change event',
        data: change,
      })
    }
  }

  window.addEventListener('resize', (): void => resetBounders())

  document.addEventListener('keyup', (): void => {
    if (__currentlyEditingEl)
      setBounderStyle('keyup', __currentlyEditingEl, bounderEdit)
  })

  if (doneEditingEl) {
    doneEditingEl.addEventListener('click', () => {
      if (__currentlyEditingEl) {
        sendChangeEvent(__currentlyEditingEl)
        doneEditingEl.innerHTML = 'change added'
        resetBounders()
      }
    })
  }

  let count = 0
  const timeStart = performance.now()

  const editableElements
    = 'h1, h2, h3, h4, h5, h6, p, button, label, li, span, a, sup, sub, blockquote, strong, cite, b, big, address, aside, dd, dl, dt'

  document
    .querySelectorAll<HTMLElement>(editableElements)
    .forEach((el: HTMLElement) => {
      count++

      if (!el.innerHTML)
        return

      const { hash, selector } = elementId(el)

      el.dataset.hash = hash
      el.dataset.selector = selector

      if (!window.kaptionOriginals)
        window.kaptionOriginals = {}

      window.kaptionOriginals[hash] = {
        hash,
        selector,
        html: el.innerHTML,
      }
      // make editable
      el.setAttribute('contentEditable', 'true')
      // disabled click events
      el.addEventListener('click', (event: MouseEvent) => {
        const { altKey } = event
        if (!altKey) {
          event.preventDefault()
          event.stopPropagation()

          setBounderStyle('click', event.target as HTMLElement, bounderEdit)
        }
      })

      el.addEventListener('mouseover', (event: MouseEvent) => {
        const { altKey } = event

        if (!altKey) {
          setBounderStyle(
            'mouseover',
            event.target as HTMLElement,
            bounderHover,
          )
        }
      })
    })

  const turnOff = (): void => {
    resetBounders()
    document
      .querySelectorAll<HTMLElement>(editableElements)
      .forEach((el: HTMLElement) => el.removeAttribute('contentEditable'))
  }

  const turnOn = (): void => {
    document
      .querySelectorAll<HTMLElement>(editableElements)
      .forEach((el: HTMLElement) => el.setAttribute('contentEditable', 'true'))
  }
  onEvent('keypress', (args: { direction: 'up' | 'down', key: string }) => {
    const { direction, key } = args
    if (key === 'Alt') {
      if (direction === 'up')
        turnOn()
      else if (direction === 'down')
        turnOff()
    }
  })

  document
    .querySelectorAll<HTMLElement>('a[href]')
    .forEach((el: HTMLElement) => {
      // disabled click events
      el.addEventListener('click', (event: MouseEvent) => {
        if (event.altKey)
          sendNavigateMessage(el, event)
      })
    })
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Alt')
      turnOff()
  })
  document.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Alt')
      turnOn()
  })
  logger.log({
    level: 'info',
    description: 'page made editable',
    data: {
      count,
      time: performance.now() - timeStart,
    },
  })
}
