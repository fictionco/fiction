/**
 * @vitest-environment happy-dom
 */

import { beforeAll, describe } from 'vitest'
import type { ServiceList } from '@factor/api'
import type { Interaction } from '@factor/api/test-utils'
import { createTestUtilServices, testComponentStability } from '@factor/api/test-utils'

import { inputs } from '../inputs'

let service: ServiceList

describe('inputs', async () => {
  beforeAll(async () => {
    service = createTestUtilServices()
  })

  await testComponentStability({
    name: 'InputText',
    Component: inputs.InputText.el,
    service,
    interactions: [
      { action: 'typeText', expectedValue: 'hello', typeText: 'hello' },
      { action: 'typeText', expectedValue: 'world', typeText: 'world' },
    ],
  })
  const p = Object.entries(inputs).map(async ([name, conf]) => {
    const textInputs = ['InputText', 'InputTextarea', 'InputPassword', 'InputEmail', 'InputUrl']

    const interactions: Interaction[] = textInputs.includes(name)
      ? [
          { action: 'typeText', expectedValue: 'hello', typeText: 'hello' },
          { action: 'typeText', expectedValue: 'world', typeText: 'world' },
        ]
      : []

    await testComponentStability({ name, Component: conf.el, service, interactions })
  })
  await Promise.all(p)
})
