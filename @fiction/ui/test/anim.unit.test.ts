// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest'

import { splitLetters } from '../anim/index.js'

describe('splitLetters', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="test"></div>`
  })

  it('wraps each character of plain text in a span with class fx', () => {
    const element = document.getElementById('test')
    element!.textContent = 'Hello'
    splitLetters('#test')

    expect(element!.innerHTML).toBe(
      `<span class="word"><span class="fx">H</span><span class="fx">e</span><span class="fx">l</span><span class="fx">l</span><span class="fx">o</span></span>`,
    )
  })

  it('keeps special HTML characters intact while wrapping others', () => {
    const element = document.getElementById('test')
    element!.textContent = 'Good &amp; Evil'
    splitLetters('#test')

    expect(element!.innerHTML).toBe(
      `<span class="word"><span class="fx">G</span><span class="fx">o</span><span class="fx">o</span><span class="fx">d</span></span> <span class="fx">&</span> <span class="word"><span class="fx">E</span><span class="fx">v</span><span class="fx">i</span><span class="fx">l</span></span>`,
    )
  })

  it('handles text with embedded HTML tags correctly', () => {
    const element = document.getElementById('test')
    element!.innerHTML = 'Hello <strong>world</strong>!'
    splitLetters('#test')

    expect(element!.innerHTML).toBe(
      `<span class="word"><span class="fx">H</span><span class="fx">e</span><span class="fx">l</span><span class="fx">l</span><span class="fx">o</span></span> <strong><span class="word"><span class="fx">w</span><span class="fx">o</span><span class="fx">r</span><span class="fx">l</span><span class="fx">d</span></span></strong><span class="word"><span class="fx">!</span></span>`,
    )
  })

  it('handles mixed text and HTML tags', () => {
    const element = document.getElementById('test')
    element!.innerHTML = 'Hello <strong>world</strong>! <span>foo</span>'
    splitLetters('#test')

    expect(element!.innerHTML).toBe(
      `<span class="word"><span class="fx">H</span><span class="fx">e</span><span class="fx">l</span><span class="fx">l</span><span class="fx">o</span></span> <strong><span class="word"><span class="fx">w</span><span class="fx">o</span><span class="fx">r</span><span class="fx">l</span><span class="fx">d</span></span></strong><span class="word"><span class="fx">!</span></span> <span><span class="word"><span class="fx">f</span><span class="fx">o</span><span class="fx">o</span></span></span>`,
    )
  })

  it('handles nested HTML tags', () => {
    const element = document.getElementById('test')
    element!.innerHTML = '<span>Hello <strong>world</strong></span>'
    splitLetters('#test')

    expect(element!.innerHTML).toBe(
    `<span><span class="word"><span class="fx">H</span><span class="fx">e</span><span class="fx">l</span><span class="fx">l</span><span class="fx">o</span></span> <strong><span class="word"><span class="fx">w</span><span class="fx">o</span><span class="fx">r</span><span class="fx">l</span><span class="fx">d</span></span></strong></span>`,
    )
  })

  it('handles only special HTML characters', () => {
    const element = document.getElementById('test')
    element!.textContent = '&amp;&copy;'
    splitLetters('#test')

    expect(element!.innerHTML).toBe('<span class="fx">&</span><span class="fx">©</span>')
  })

  it('handles empty text', () => {
    const element = document.getElementById('test')
    element!.textContent = ''
    splitLetters('#test')

    expect(element!.innerHTML).toBe('')
  })
})
