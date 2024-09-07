import * as jsdom from 'jsdom'
import { beforeAll, describe, expect, it } from 'vitest'
import { populateGlobal } from '../globalUtils'
import { clean } from '../libraries'

// Helper function to compare two SVG strings by converting them to DOM trees
function compareSVGs(actual: string, expected: string) {
  const domActual = new jsdom.JSDOM(actual).window.document.body.firstChild
  const domExpected = new jsdom.JSDOM(expected).window.document.body.firstChild
  return domActual?.isEqualNode(domExpected)
}

describe('clean function', () => {
  beforeAll(() => {
    populateGlobal(globalThis, new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
      url: 'http://localhost', // Set a URL to avoid "opaque" origin issues.
    }).window, { bindFunctions: true })
  })
  it('sanitizes string with script tag', () => {
    const dirty = '<script>alert("xss")</script>Hello'
    expect(clean(dirty)).toBe('Hello')
  })

  it('handles non-string inputs', () => {
    const notString = { text: 'Hello' }
    expect(clean(notString)).toBe('text is not a string (object)')
  })

  it('returns empty string for falsy input', () => {
    expect(clean(null)).toBe('')
    expect(clean(undefined)).toBe('')
    expect(clean('')).toBe('')
  })

  it('sanitizes SVG with allowed tags and attributes', () => {
    const svg = '<svg><defs></defs><use xlink:href="#id"></use></svg>'
    expect(clean(svg)).toBe(svg)
  })

  it('removes disallowed tags from SVG', () => {
    const svgWithScript = '<svg><script>alert("xss")</script></svg>'
    expect(clean(svgWithScript)).toBe('<svg></svg>')
  })

  it('keeps common SVG elements and attributes', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
      <rect width="90" height="90" stroke="blue" fill="red" />
      <path d="M 10 10 H 90 V 90 H 10 L 10 10" stroke="black" fill="transparent"/>
      <text x="10" y="20" font-family="Verdana" font-size="15" fill="blue">Hello SVG</text>
      <g fill="none" stroke="black">
        <path stroke-dasharray="5,5" d="M5 20 l215 0" />
      </g>
    </svg>`
    expect(compareSVGs(clean(svg), svg)).toBe(true)
  })

  it('allows SVG use with external references', () => {
    const svgWithUse = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <circle id="circle" cx="16" cy="16" r="14" />
      </defs>
      <use xlink:href="#circle" fill="blue" />
    </svg>`
    expect(compareSVGs(clean(svgWithUse), svgWithUse)).toBe(true)
  })

  it('keeps SVG gradients', () => {
    const svgWithGradient = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="60" rx="55" ry="55" fill="url(#grad1)" />
    </svg>`
    expect(compareSVGs(clean(svgWithGradient), svgWithGradient)).toBe(true)
  })
})
