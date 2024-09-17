/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clickId, elementId } from '../tracking'

// Mock the getSelector function
vi.mock('../tracking', async (importOriginal) => {
  const mod = (await importOriginal()) as Record<string, unknown>
  return {
    ...mod,
    getSelector: vi.fn().mockImplementation(() => 'div.test-class'),
  }
})

// Mock the fastHash function
vi.mock('@fiction/core/utils/utils.js', () => ({ fastHash: vi.fn(() => 'mockedHash') }))

describe('elementId function', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockElement.className = 'test-class'
    mockElement.textContent = 'Test Content'
  })

  it('should return selector and hash for an element', () => {
    const result = elementId(mockElement)

    expect(result).toHaveProperty('selector')
    expect(result).toHaveProperty('hash')
    expect(result.selector).toBe('div.test-class')
    expect(result.hash).toBe('mockedHash')
  })

  it('should use data-selector if available', () => {
    mockElement.dataset.selector = 'custom-selector'
    const result = elementId(mockElement)

    expect(result.selector).toBe('custom-selector')
  })

  it('should use data-hash if available', () => {
    mockElement.dataset.hash = 'custom-hash'
    const result = elementId(mockElement)

    expect(result.hash).toBe('custom-hash')
  })
})
describe('clickId function', () => {
  let mockEvent: MouseEvent
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockElement.className = 'test-class'
    mockElement.textContent = 'Test Content'

    Object.defineProperty(mockElement, 'getBoundingClientRect', {
      value: () => ({
        width: 100,
        height: 50,
        left: 10,
        top: 20,
      }),
    })

    mockEvent = { target: mockElement, clientX: 35, clientY: 45 } as unknown as MouseEvent
  })

  it('should return correct click information', () => {
    const result = clickId(mockEvent)

    expect(result).toHaveProperty('hash', 'mockedHash')
    expect(result).toHaveProperty('selector', 'div.test-class')
    expect(result).toHaveProperty('position')
    expect(result).toHaveProperty('elementType', 'div')
    expect(result).toHaveProperty('elementContent', 'Test Content')
  })

  it('should calculate correct position information', () => {
    const result = clickId(mockEvent)

    expect(result.position).toEqual({
      targetWidth: 100,
      targetHeight: 50,
      offsetX: 25,
      offsetY: 25,
      xPercent: 0.25,
      yPercent: 0.5,
    })
  })

  it('should truncate element content to 50 characters', () => {
    mockElement.textContent = 'A'.repeat(100)
    const result = clickId(mockEvent)

    expect(result.elementContent).toHaveLength(50)
    expect(result.elementContent).toBe('A'.repeat(50))
  })
})
