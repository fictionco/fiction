/**
 * @vitest-environment happy-dom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BrowserEvent } from '@fiction/core/utils/eventBrowser'
import { waitFor } from '@fiction/core'
import { ActivityTrigger, canonicalUrlFromTag, detectMultiClick, getCanonicalUrl, getDeviceType, getSelector, onRageClick } from '../tracking'

describe('getDeviceType', () => {
  it('should return "mobile" for width < 600', () => {
    expect(getDeviceType(599)).toBe('mobile')
  })

  it('should return "tablet" for width between 600 and 949', () => {
    expect(getDeviceType(600)).toBe('tablet')
    expect(getDeviceType(949)).toBe('tablet')
  })

  it('should return "laptop" for width between 950 and 1550', () => {
    expect(getDeviceType(950)).toBe('laptop')
    expect(getDeviceType(1550)).toBe('laptop')
  })

  it('should return "desktop" for width > 1550', () => {
    expect(getDeviceType(1551)).toBe('desktop')
  })
})

describe('activityTrigger', () => {
  let activityTrigger: ActivityTrigger
  let onIdle: (t: number) => void
  let onActive: (ev: BrowserEvent) => void
  let onEngage: (ev: BrowserEvent) => void

  beforeEach(() => {
    onIdle = vi.fn()
    onActive = vi.fn()
    onEngage = vi.fn()
    activityTrigger = new ActivityTrigger({
      onIdle,
      onActive,
      onEngage,
      idleSeconds: 0.1,
      idleCheckMs: 40,
      idleGraceSec: 0,
    })
  })

  afterEach(() => {
    activityTrigger.reset()
  })

  it('should call onEngage on initialization', () => {
    expect(onEngage).toHaveBeenCalledWith('init')
  })

  it('should call onIdle after idle time', async () => {
    await new Promise(r => setTimeout(r, 2000))
    expect(onIdle).toHaveBeenCalledWith(expect.any(Number))
  })

  it('should call onActive and onEngage on browser events', async () => {
    await waitFor(400) // wait for idle
    window.dispatchEvent(new Event('mousemove'))

    expect(onActive).toHaveBeenCalledWith('mousemove')
    expect(onEngage).toHaveBeenCalledWith('mousemove')
  })
})

describe('canonicalUrlFromTag', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('should return undefined if no canonical tag is present', () => {
    expect(canonicalUrlFromTag()).toBeUndefined()
  })

  it('should return the href of the canonical tag', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    link.setAttribute('href', 'https://example.com')
    document.head.appendChild(link)
    expect(canonicalUrlFromTag()).toBe('https://example.com')
  })
})

describe('getCanonicalUrl', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    window.location.href = 'http://localhost/test?query=123#hash'
  })

  it('should return the current URL without hash if no canonical tag is present', () => {
    expect(window.location.href).toBe('http://localhost/test?query=123#hash')
    expect(getCanonicalUrl()).toBe('http://localhost/test?query=123')
  })

  it('should return the canonical URL with search params', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    link.setAttribute('href', 'https://example.com')
    document.head.appendChild(link)
    expect(getCanonicalUrl()).toBe('https://example.com?query=123')
  })
})

describe('detectMultiClick', () => {
  it('should return false if the number of clicks is less than count', () => {
    const result = detectMultiClick({
      count: 3,
      interval: 0.5,
      clicks: [],
      radius: 50,
    })
    expect(result).toBe(false)
  })

  it('should return true for valid multi-click within interval and radius', () => {
    const now = new Date()
    const clicks = [
      { event: { clientX: 10, clientY: 10 } as MouseEvent, time: new Date(now.getTime() - 400) },
      { event: { clientX: 15, clientY: 15 } as MouseEvent, time: new Date(now.getTime() - 300) },
      { event: { clientX: 20, clientY: 20 } as MouseEvent, time: new Date(now.getTime() - 200) },
    ]
    const result = detectMultiClick({
      count: 3,
      interval: 0.5,
      clicks,
      radius: 50,
    })
    expect(result).toBe(true)
  })
})

describe('onRageClick', () => {
  it('should call the callback on rage click', () => {
    const cb = vi.fn()
    onRageClick(cb)

    const event = { clientX: 10, clientY: 10 } as MouseEvent
    document.dispatchEvent(new MouseEvent('click', event))
    document.dispatchEvent(new MouseEvent('click', event))
    document.dispatchEvent(new MouseEvent('click', event))

    expect(cb).toHaveBeenCalled()
  })
})

describe('getSelector', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <div class="container">
          <div id="unique">
            <span class="inner first">First</span>
            <span class="inner second">Second</span>
          </div>
          <p class="text">Paragraph</p>
        </div>
        <div class="sibling">Sibling</div>
      </div>
    `
  })

  it('should return the CSS path of an element', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el)).toBe('div#unique > span.inner.first')
  })

  it('should return an empty string for null element', () => {
    expect(getSelector(null)).toBe('')
  })

  it('should handle elements with multiple classes', () => {
    const el = document.querySelector('.inner.second') as HTMLElement
    expect(getSelector(el)).toBe('div#unique > span.inner.second:nth-of-type(2)')
  })

  it('should return only ID for elements with ID when idOnly is true', () => {
    const el = document.querySelector('#unique') as HTMLElement
    expect(getSelector(el, { idOnly: true })).toBe('div#unique')
  })

  it('should respect maxDepth option', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el, { maxDepth: 2 })).toBe('div#unique > span.inner.first')
  })

  it('should not include classes when includeClasses is false', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el, { includeClasses: false })).toBe('div#unique > span')
  })

  it('should generate full path when shortestPath is false', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el, { shortestPath: false })).toBe('html > body > div#root > div > div#unique > span.inner.first')
  })

  it('should handle elements without ID or class', () => {
    const el = document.querySelector('p') as HTMLElement
    expect(getSelector(el)).toBe('div#root > div > p.text')
  })

  it('should handle sibling elements correctly', () => {
    const el = document.querySelector('.sibling') as HTMLElement
    expect(getSelector(el)).toBe('div#root > div.sibling:nth-of-type(2)')
  })

  it('should return only tag name for body element', () => {
    expect(getSelector(document.body)).toBe('html > body')
  })

  it('should handle deeply nested elements', () => {
    document.body.innerHTML = '<div><div><div><div><p>Deep</p></div></div></div></div>'
    const el = document.querySelector('p') as HTMLElement
    expect(getSelector(el)).toBe('html > body > div > div > div > div > p')
  })
})

describe('getSelector with Tailwind classes', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root" class="container mx-auto">
        <div class="flex flex-col items-center">
          <div id="unique" class="bg-blue-500 p-4">
            <span class="inner first text-white hover:text-gray-200">First</span>
            <span class="inner second text-white hover:text-gray-200">Second</span>
          </div>
          <p class="text mt-4 text-lg font-bold">Paragraph</p>
        </div>
        <div class="sibling mt-8 p-4 bg-gray-100">Sibling</div>
      </div>
    `
  })

  it('should ignore Tailwind classes by default', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el)).toBe('div#unique > span.inner.first')
  })

  it('should include Tailwind classes when ignoreTailwindClasses is false', () => {
    const el = document.querySelector('.inner') as HTMLElement
    expect(getSelector(el, { ignoreTailwindClasses: false }))
      .toBe('div#unique > span.inner.first.text-white.hover:text-gray-200')
  })

  it('should handle elements with only Tailwind classes', () => {
    const el = document.querySelector('.flex') as HTMLElement
    expect(getSelector(el)).toBe('div#root > div')
  })

  it('should handle elements with mixed Tailwind and custom classes', () => {
    const el = document.querySelector('.text') as HTMLElement
    expect(getSelector(el)).toBe('div#root > div > p.text')
  })

  it('should ignore Tailwind classes in nth-of-type calculations', () => {
    const el = document.querySelector('.inner.second') as HTMLElement
    expect(getSelector(el)).toBe('div#unique > span.inner.second:nth-of-type(2)')
  })

  it('should handle Tailwind responsive classes', () => {
    document.body.innerHTML = `
      <div class="sm:w-1/2 md:w-1/3 lg:w-1/4 custom-class"></div>
    `
    const el = document.querySelector('.custom-class') as HTMLElement
    expect(getSelector(el)).toBe('html > body > div.custom-class')
  })

  it('should handle Tailwind state classes', () => {
    document.body.innerHTML = `
      <button class="bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 custom-btn">
        Click me
      </button>
    `
    const el = document.querySelector('.custom-btn') as HTMLElement
    expect(getSelector(el)).toBe('html > body > button.custom-btn')
  })

  it('should handle elements with only Tailwind utility classes', () => {
    document.body.innerHTML = `
      <div class="flex items-center justify-between p-4 bg-gray-100"></div>
    `
    const el = document.querySelector('.flex') as HTMLElement
    expect(getSelector(el)).toBe('html > body > div')
  })

  it('should handle Tailwind arbitrary values', () => {
    document.body.innerHTML = `
      <div class="top-[117px] left-[23px] bg-[#bada55] custom-arbitrary"></div>
    `
    const el = document.querySelector('.custom-arbitrary') as HTMLElement
    expect(getSelector(el)).toBe('html > body > div.custom-arbitrary')
  })

  it('should handle Tailwind group classes', () => {
    document.body.innerHTML = `
      <div class="group bg-white hover:bg-gray-100">
        <p class="text-gray-700 group-hover:text-gray-900 custom-group">Text</p>
      </div>
    `
    const el = document.querySelector('.custom-group') as HTMLElement
    expect(getSelector(el)).toBe('html > body > div > p.custom-group')
  })
})
