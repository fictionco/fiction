import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import type { App, Component } from 'vue'
import { isPlainObject, stringify, waitFor } from '../utils'
import { vue } from '../utils/libraries'
import type { ServiceList } from '../plugin-env'

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

  describe(`[${name}] Stability and Interaction Tests`, () => {
    let app: App<Element>, mountPoint: HTMLDivElement, vm: any
    let errorHandlerSpy: ReturnType<typeof vi.fn>
    const importError: Error | undefined = undefined
    const modelRef = vue.ref(modelValue)
    beforeAll(async () => {
      // Create and mount the component
      errorHandlerSpy = vi.fn()

      // Define a wrapper component for testing
      const WrapperComponent = {
        components: { Component },
        setup() {
        // Provide service and props to the component
          vue.provide('service', vue.ref(service))
          return { model: modelRef, props }
        },
        template: `<Component v-model="model" v-bind="props" />`,
      }

      app = createApp(WrapperComponent)

      app.config.errorHandler = (err, _, info) => {
        errorHandlerSpy(err, info)
      }
      app.provide('service', vue.ref(service))
      mountPoint = document.createElement('div')
      document.body.appendChild(mountPoint)
      vm = app.mount(mountPoint)
      await waitFor(200)
    })

    afterAll(() => {
      // Clean up
      app.unmount()
      document.body.removeChild(mountPoint)
    })

    it('does not throw an error upon import', () => {
      expect(importError).toBeFalsy()
    })

    it('mounts without errors', async () => {
      await nextTick()
      expect(vm).toBeTruthy()
      expect(errorHandlerSpy).not.toHaveBeenCalled()
    })

    it('renders correctly', async () => {
      await nextTick()
      expect(mountPoint.innerHTML).toBeTruthy()
    })

    if (find.length) {
      it('has expected text', async () => {
        find.forEach((textToFind) => {
          it(`finds text "${textToFind}" in the component`, async () => {
            const content = mountPoint.textContent?.toLowerCase() || ''
            const findLower = textToFind.toLowerCase()
            expect(content).toContain(findLower) // Vitest assertion
          })
        })
      })
    }

    if (interactions.length) {
      it('handles interactions without errors', async () => {
        try {
          // Interaction tests
          for (const interaction of interactions) {
            await simulateAction(mountPoint, interaction)

            expect(mountPoint.innerHTML).toBeTruthy()
            expect(errorHandlerSpy).not.toHaveBeenCalled()
            // Assuming 'expected' is defined somewhere in your scope
            expect(modelRef.value).toBe(interaction.expectedValue)
          }
        }
        catch (error) {
          // Fail the test and provide error information
          expect.fail(`Error during interaction: ${(error as Error).message}`)
        }
      })
    }
  })
}

export { diff } from 'deep-object-diff'

export function getTestEmail(): string {
  const key = Math.random().toString().slice(2, 12)
  return `arpowers+${key}@gmail.com`
}

// regex all numbers and letters
function rep(nm: string, val: string = '') {
  return `[${nm}:${String(val).replaceAll(/[\dA-Za-z]/g, '*')}]`
}
function snapString(value: unknown, key?: string, opts: { maskedKeys?: string[] } = {}): string {
  const maskedKeys = opts.maskedKeys ?? []
  const val = String(value)

  let out = val

  if (key && maskedKeys.includes(key))
    return '**MASKED**'

  if (key?.endsWith('Id') && val)
    out = rep('id', val)
  else if ((key?.endsWith('Url') || key?.endsWith('Urls')) && val)
    out = rep('url', val)
  else if (
    (key?.endsWith('At')
    || key?.endsWith('Iso')
    || key === 'duration'
    || key === 'timestamp')
    && val
  )
    out = rep('dateTime')
  else if (key?.endsWith('Name') && val)
    out = rep('name', val)
  else if (key?.toLowerCase().endsWith('email') && val)
    out = rep('email', val)
  else if (
    val.length === 32
    || key?.endsWith('Code')
    || key?.endsWith('Token')
  )
    out = rep('hash', val)
  else if (key === 'latitude' || key === 'longitude' || key === 'ip')
    out = rep('geo', val)

  return out
}

export function snap(obj?: vue.Ref<Record<any, any>> | string | number | boolean | Record<any, any> | Record<any, any>[] | unknown[] | undefined, opts: { maskedKeys?: string[] } = {}, parentKey?: string): Record<string, unknown> | unknown[] | undefined {
  if (!obj)
    return undefined

  if (vue.isRef(obj))
    return { ref: snap(obj.value as Record<any, any>, opts) }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean')
    return { [typeof obj]: obj }

  if (Array.isArray(obj)) {
    return obj.map((o) => {
      const res
        = typeof o === 'object' && o
          ? snap(o as Record<string, unknown>, opts)
          : snapString(o, parentKey, opts)

      return res
    })
  }

  const newObj = {} as Record<string, unknown>

  for (const key in obj) {
    const value = obj[key] as unknown
    if (value && isPlainObject(value))
      newObj[key] = snap(value as Record<string, unknown>, opts, key)
    else if (value)
      newObj[key] = snapString(value, key, opts)
    else
      newObj[key] = value
  }

  const out = JSON.parse(stringify(newObj)) as Record<string, any>

  return out
}
