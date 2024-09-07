/**
 * @vitest-environment happy-dom
 */

import { vue } from '@fiction/core'
import { beforeAll, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { useService } from '../inject'
import { Obj } from '../obj'

describe('useService', () => {
  beforeAll(async () => { })
  it('useService: should return the injected service', () => {
    // Child component
    const Child = defineComponent({
      setup() {
        const service = useService()
        return { serviceItems: Object.keys(service || {}) }
      },
      template: '<div>{{ serviceItems.join(", ") }}</div>',
    })

    // Parent component
    const Parent = defineComponent({
      components: { Child },
      template: '<div><Child/></div>',
    })

    const app = vue.createApp(Parent)

    const mountEl = document.createElement('div')

    expect(() => {
      app.mount(mountEl)
    }, 'should should error if service is not provided').toThrowError()

    app.provide('service', vue.ref({ test: 1 }))

    app.mount(mountEl)

    expect(mountEl.innerHTML).toContain('test')
  })
})

class TestObj extends Obj<{ testProp: string }> {
  constructor(name: string, settings: { testProp: string }) {
    super(name, settings)
  }
}

describe('obj class', () => {
  it('should correctly initialize properties', () => {
    const settings = { testProp: 'value' }
    const testObj = new TestObj('TestName', settings)

    expect(testObj.name).toBe('TestName')
    expect(testObj.settings).toEqual(settings)
    // Check if log is initialized, depending on how your logging is set up
    expect(testObj.log).toBeDefined()
  })

  it('toJSON should omit specified properties', () => {
    const settings = { testProp: 'value' }
    const testObj = new TestObj('TestName', settings)
    const json = testObj.toJSON()

    expect(json.name).toBe('TestName')
    expect(json.settings).toBeUndefined()
    expect(json.log).toBeUndefined()
    expect(json.toJSON).toBeUndefined()

    expect(JSON.stringify(testObj)).toMatchInlineSnapshot(`"{"name":"TestName"}"`)
  })
})
