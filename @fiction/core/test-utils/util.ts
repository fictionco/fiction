import type { Component } from 'vue'
import type { ServiceList } from '../plugin-env/index.js'
import path from 'node:path'
import { expect, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { safeDirname, waitFor } from '../utils/index.js'
import { vue } from '../utils/libraries.js'

const toolUtilsRoot = safeDirname(import.meta.url)
// test special characters in path
const testVideoPath = path.join(toolUtilsRoot, './img/test-video.mp4')
const testImgPath = path.join(toolUtilsRoot, './img/test (#).jpg')
const testSvgPath = path.join(toolUtilsRoot, './img/favicon.svg')
const testPngPath = path.join(toolUtilsRoot, './img/favicon.png')
const testEnvFile = path.join(toolUtilsRoot, '.env.test')

export { testEnvFile, testImgPath, testPngPath, testSvgPath, testVideoPath, toolUtilsRoot }

type ActionType = 'select' | 'input' | 'typeText' | 'click' | 'find'
export interface Interaction {
  action: ActionType
  selector?: string
  expectedValue: unknown
  typeText?: string
  check?: (element: Element, expectedValue: unknown) => void
}
async function simulateAction(mountPoint: HTMLDivElement, interaction: Interaction): Promise<void> {
  const { action, selector, typeText } = interaction

  if (action === 'click') {
    const el = selector ? mountPoint.querySelector(selector) : mountPoint
    if (!el)
      throw new Error(`No element found for selector '${selector}'`)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }
  else if (action === 'typeText') {
    const inputElement = (selector ? mountPoint.querySelector(selector) : mountPoint.querySelector('input, textarea')) as HTMLInputElement
    if (!inputElement)
      throw new Error(`No element found for selector '${selector}'`)

    inputElement.value = typeText || ''
    inputElement.dispatchEvent(new Event('input', { bubbles: true }))
  }

  await nextTick()
}

export async function testComponentStability(args: {
  Component: Component
  name?: string
  props?: { [key: string]: unknown }
  service?: ServiceList
  interactions?: Interaction[]
  find?: string[]
  modelValue?: unknown
}): Promise<void> {
  const {
    Component,
    name = 'Component',
    props = {},
    service = {},
    interactions = [],
    find = [],
    modelValue,
  } = args

  const start = performance.now()

  // Create fresh refs for each test
  const modelRef = vue.ref(modelValue)

  // Setup
  const errorHandlerSpy = vi.fn()

  // Create unique mount point
  const mountPoint = document.createElement('div')
  mountPoint.id = `test-mount-${name}-${Date.now()}`
  document.body.appendChild(mountPoint)

  const WrapperComponent = {
    components: { Component },
    setup() {
      vue.provide('service', vue.ref(service))
      return { model: modelRef, props }
    },
    template: `<div class="x-site"><Component v-model="model" v-bind="props" /></div>`,
  }

  const app = createApp(WrapperComponent)
  app.config.errorHandler = (err, _, info) => {
    errorHandlerSpy(err, info)
  }

  // Mount
  const vm = app.mount(mountPoint)
  await waitFor(200)

  try {
    // Run tests
    expect(vm).toBeTruthy()
    expect(errorHandlerSpy).not.toHaveBeenCalled()
    expect(mountPoint.innerHTML).toBeTruthy()

    const end = performance.now()
    expect(end - start).toBeLessThan(1000)

    // Run interactions
    for (const interaction of interactions) {
      await simulateAction(mountPoint, interaction)
      expect(mountPoint.innerHTML).toBeTruthy()
      expect(errorHandlerSpy).not.toHaveBeenCalled()
      expect(modelRef.value).toBe(interaction.expectedValue)
    }

    // Run text find tests
    for (const textToFind of find) {
      const content = mountPoint.textContent?.toLowerCase() || ''
      expect(content).toContain(textToFind.toLowerCase())
    }
  }
  finally {
    // Cleanup
    app.unmount()
    mountPoint.remove()
  }
}

export { diff } from 'deep-object-diff'

export function getTestEmail(): string {
  const key = Math.random().toString().slice(2, 12)
  return `arpowers+${key}@gmail.com`
}

// regex all numbers and letters
function rep(nm: string, val: string = '') {
  return `[${nm}:${String(val).replaceAll(/[\dA-Z]/gi, '*')}]`
}
function snapString(value: unknown, key?: string, opts: { maskedKeys?: string[] } = {}): string {
  const maskedKeys = opts.maskedKeys ?? []

  // Handle null/undefined early
  if (value == null)
    return String(value)

  // If value is an object, return its type
  if (typeof value === 'object') {
    return `[${value.constructor.name}]`
  }

  const val = String(value)

  if (key && maskedKeys.includes(key))
    return '**MASKED**'

  // Patterns with common identifiers
  const patterns = {
    id: /Id$/,
    url: /(Url|Urls)$/,
    datetime: /(At|Iso|date)$|^(duration|timestamp)$/,
    name: /Name$/,
    email: /email$/i,
    hash: (v: string) => v.length === 32 || /^(Code|Token)$/.test(v),
    geo: /^(latitude|longitude|ip)$/,
  }

  // Check each pattern
  for (const [type, pattern] of Object.entries(patterns)) {
    if (key && (pattern instanceof RegExp ? pattern.test(key) : pattern(key))) {
      return `[${type}:${val ? 'TRUTHY' : 'FALSY'}]`
    }
  }

  return val
}

export function snap(
  obj?: vue.Ref<Record<any, any>> | string | number | boolean | Record<any, any> | Record<any, any>[] | unknown[] | undefined,
  opts: { maskedKeys?: string[] } = {},
  parentKey?: string,
): Record<string, unknown> | unknown[] | undefined {
  if (!obj)
    return undefined

  // Handle Vue refs
  if (vue.isRef(obj))
    return { ref: snap(obj.value as any, opts) }

  // Handle primitives
  if (typeof obj !== 'object')
    return { [typeof obj]: obj }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      return typeof item === 'object' && item !== null
        ? snap(item, opts)
        : snapString(item, parentKey, opts)
    })
  }

  // Handle objects
  const newObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = value && typeof value === 'object'
      ? snap(value, opts, key)
      : snapString(value, key, opts)
  }

  return JSON.parse(JSON.stringify(newObj))
}
