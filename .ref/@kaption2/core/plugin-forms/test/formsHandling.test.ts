/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { snap } from '@factor/api/testUtils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { KaptionForms } from '..'
import type { FormConfig } from '../form'
import { templates } from '../form'

type CurrentTestUtils = KaptionTestUtils & { kaptionForms: KaptionForms }
let testUtils: CurrentTestUtils | undefined
let formId: string | undefined
let _projectId: string | undefined
let responseForm: FormConfig | undefined

const confirmMock = vi.fn(() => {
  return () => true
})

vi.stubGlobal('confirm', confirmMock)

describe('forms handling', () => {
  beforeAll(async () => {
    const utils = await createKaptionTestUtils()

    const kaptionForms = new KaptionForms(utils)

    utils.kaptionForms = kaptionForms

    testUtils = utils as CurrentTestUtils

    testUtils.initialized = await testUtils.init()

    _projectId = testUtils.factorAdmin.activeProjectId.value
  })

  it('creates form via request', async () => {
    const scratchTemplate = templates.find(
      t => t.templateId.value === 'scratch',
    )
    if (!scratchTemplate)
      throw new Error('scratch template not found')

    const r = await testUtils?.kaptionForms.requests.ManageForms.projectRequest(
      {
        _action: 'create',
        form: { userConfig: { formName: 'hello' }, templateId: 'scratch' },
      },
    )
    responseForm = r?.data
    expect(r?.message).toMatchInlineSnapshot('"form created"')
    expect(responseForm?.projectId?.length).toBeGreaterThan(10)
    expect(responseForm?.userConfig?.formName).toBe('hello')
    formId = responseForm?.formId
    expect(formId).toBeTruthy()
    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": null,
        "config": null,
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": null,
        "formId": "[id:***]",
        "formName": null,
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": null,
        "updatedAt": "[dateTime:]",
        "userConfig": {
          "formName": "[name:*****]",
        },
        "views": null,
      }
    `)
  })

  it('loads form based on formId param in route', async () => {
    if (!testUtils)
      throw new Error('testUtils not defined')

    await testUtils?.factorRouter.goto('formBuilder', { formId })

    const formState = testUtils?.kaptionForms.activeFormState
    const activeForm = testUtils?.kaptionForms.activeForm
    expect(activeForm.value).toMatchInlineSnapshot('undefined')

    expect(formState.value).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "loading": Promise {},
        "status": "loading",
      }
    `)

    await formState.value.loading
    expect(formState.value.status).toMatchInlineSnapshot('"success"')
    expect(formState.value.data?.cards.value.length).toMatchInlineSnapshot('0')

    expect(activeForm.value).toBe(formState.value.data)
  })

  it('adds new cards', async () => {
    const form = testUtils?.kaptionForms.activeForm.value
    if (!form)
      throw new Error('form not defined')

    await form?.addNewElement('multipleChoice')

    expect(form.cards.value.length).toBe(1)
  })

  it('loads form index', async () => {
    if (!testUtils)
      throw new Error('testUtils not defined')

    await testUtils?.factorRouter.goto('formIndex')

    const formIndexState = testUtils?.kaptionForms.activeFormIndexState
    const activeFormIndex = testUtils?.kaptionForms.activeFormIndex

    expect(formIndexState.value).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "loading": Promise {},
        "status": "loading",
      }
    `)

    await formIndexState.value.loading
    expect(formIndexState.value.status).toMatchInlineSnapshot('"success"')
    expect(formIndexState.value.data?.length).toMatchInlineSnapshot('1')

    expect(activeFormIndex.value).toBe(formIndexState.value.data)
  })

  it('updates a card in the form', () => {
    if (!testUtils)
      throw new Error('testUtils not defined')
    if (!responseForm)
      throw new Error('no responseform')

    const cardId
      = testUtils?.kaptionForms.activeForm.value?.cards.value?.[0].cardId

    expect(cardId).toBeTruthy()

    if (!cardId)
      throw new Error('no cardId')

    testUtils.kaptionForms.updateCardById(cardId, {
      userConfig: { question: 'test' },
    })
  })

  it('deletes input by id', () => {
    const form = testUtils?.kaptionForms.activeForm.value

    expect(form?.activeId.value).toBeTruthy()

    expect(form?.cards.value.length).toBe(1)

    expect(snap(form?.cards.value)).toMatchInlineSnapshot(`
      [
        {
          "cardId": "[id:************************]",
          "inputs": [
            {
              "inputId": "[id:************************]",
              "userConfig": {
                "cardTypeKey": "multipleChoice",
              },
            },
          ],
          "userConfig": {
            "title": "test",
          },
        },
      ]
    `)

    form?.deleteById([form?.activeId.value])

    expect(snap(form?.cards.value)).toMatchInlineSnapshot(`
      [
        {
          "cardId": "[id:************************]",
          "inputs": [],
          "userConfig": {
            "title": "test",
          },
        },
      ]
    `)

    expect(form?.cards.value[0].userConfig?.cards?.length).toBe(0)

    expect(form?.activeId.value).toBe(form?.cards.value[0].cardId)
  })
})
