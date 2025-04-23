/**
 * @vitest-environment happy-dom
 */

import type { Interaction } from '@fiction/core/test-utils'
import { log } from '@fiction/core'
import { createTestUtilServices, testComponentStability } from '@fiction/core/test-utils'
import { beforeAll, describe, it } from 'vitest'

import { InputOption, inputs } from '../inputs/index.js'

describe('inputs', () => { // Remove async from describe
  const logger = log.contextLogger('inputsTest')
  const service = createTestUtilServices()

  beforeAll(() => {
    const xSite = document.createElement('div')
    xSite.className = 'x-site'
    document.body.appendChild(xSite)
  })

  // Test each input sequentially
  const inputList = inputs
  Object.entries(inputList).forEach(([name, conf]) => {
    describe(`${name} Component`, () => {
      const textInputs = ['InputText', 'InputTextarea', 'InputPassword', 'InputEmail', 'InputUrl']

      const props: Record<string, any> = {}
      if (name === 'InputHandle') {
        props.table = 'fiction_user'
      }
      else if (name === 'InputControl') {
        props.controlOption = new InputOption({ label: 'hello' })
      }

      const interactions: Interaction[] = textInputs.includes(name)
        ? [
            { action: 'typeText', expectedValue: 'hello', typeText: 'hello' },
            { action: 'typeText', expectedValue: 'world', typeText: 'world' },
          ]
        : []

      it(`${name} stability test`, async () => {
        logger.info(`testing ${name}`)
        await testComponentStability({
          name,
          Component: conf.el,
          service,
          interactions,
          props,
        })
      })
    })
  })
})
