import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { snap } from '@factor/api/testUtils'
import { beforeAll, describe, expect, it } from 'vitest'
import { KaptionForms } from '..'
import { templates } from '../form'

type CurrentTestUtils = KaptionTestUtils & { kaptionForms: KaptionForms }
let testUtils: CurrentTestUtils | undefined
let formId: string | undefined
let projectId: string | undefined
describe('forms endpoint', () => {
  beforeAll(async () => {
    const utils = await createKaptionTestUtils()

    const kaptionForms = new KaptionForms(utils)

    utils.kaptionForms = kaptionForms

    testUtils = utils as CurrentTestUtils

    testUtils.initialized = await testUtils.init()

    projectId = testUtils.factorAdmin.activeProjectId.value
  })
  it('creates user forms', async () => {
    const scratchTemplate = templates.find(
      t => t.templateId.value === 'scratch',
    )
    if (!scratchTemplate)
      throw new Error('scratch template not found')

    const r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'create',
        projectId,
        form: scratchTemplate.toConfig(),
      },
      { bearer: testUtils.initialized?.user },
    )
    const responseForm = r?.data
    expect(r?.message).toMatchInlineSnapshot('"form created"')
    expect(responseForm?.projectId?.length).toBeGreaterThan(10)
    expect(responseForm?.userConfig?.formName).toBe('Kaption Form')
    formId = responseForm?.formId
    expect(formId).toBeTruthy()
    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "aside": [],
            "cardId": "[id:************************]",
            "choices": [
              "choice1",
              "choice2",
              "choice3",
            ],
            "config": {},
            "logic": [],
            "typeKey": "multipleChoice",
          },
        ],
        "config": {},
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": null,
        "formId": "[id:**]",
        "formName": "[name:******* ****]",
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": null,
        "updatedAt": "[dateTime:]",
        "views": null,
      }
    `)
  })

  it('requests user forms', async () => {
    const r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'retrieve',
        form: { formId },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )
    const responseForm = r?.data
    expect(r?.message).toBeUndefined()
    expect(responseForm?.formId).toBe(formId)
    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "aside": [],
            "cardId": "[id:************************]",
            "choices": [
              "choice1",
              "choice2",
              "choice3",
            ],
            "config": {},
            "logic": [],
            "typeKey": "multipleChoice",
          },
        ],
        "config": {},
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": null,
        "formId": "[id:**]",
        "formName": "[name:******* ****]",
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": null,
        "updatedAt": "[dateTime:]",
        "views": null,
      }
    `)
  })

  it('updates user forms', async () => {
    const formName = 'Kaption Form Updated'
    const description = 'updated form description'
    let r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'update',
        form: { formId, userConfig: { formName, description } },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )
    let responseForm = r?.data
    expect(r?.message).toMatchInlineSnapshot('"form updated"')
    expect(responseForm?.formId).toBe(formId)
    expect(responseForm?.userConfig?.formName).toBe(formName)
    expect(responseForm?.userConfig?.description).toBe(description)
    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "aside": [],
            "cardId": "[id:************************]",
            "choices": [
              "choice1",
              "choice2",
              "choice3",
            ],
            "config": {},
            "logic": [],
            "typeKey": "multipleChoice",
          },
        ],
        "config": {},
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": "updated form description",
        "formId": "[id:**]",
        "formName": "[name:******* **** *******]",
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": null,
        "updatedAt": "[dateTime:]",
        "views": null,
      }
    `)

    r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'update',
        form: {
          formId,
          userConfig: {
            cards: [
              {
                userConfig: {
                  cards: [
                    {
                      userConfig: {
                        cardTypeKey: 'multipleChoice',
                        choices: ['test'].join(`\n`),
                      },
                    },
                  ],
                },
              },
              {
                userConfig: {
                  cards: [{ userConfig: { cardTypeKey: 'shortText' } }],
                },
              },
            ],
          },
        },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )

    responseForm = r?.data

    expect(responseForm?.userConfig?.description).toBe(description)
    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "choices": [
              "test",
            ],
            "typeKey": "multipleChoice",
          },
          {
            "typeKey": "shortText",
          },
        ],
        "config": {},
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": "updated form description",
        "formId": "[id:**]",
        "formName": "[name:******* **** *******]",
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": null,
        "updatedAt": "[dateTime:]",
        "views": null,
      }
    `)
  })

  it('deletes user forms', async () => {
    let r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'delete',
        form: { formId },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )
    let responseForm = r?.data
    expect(r?.message).toMatchInlineSnapshot('"form deleted"')
    expect(responseForm?.formId).toBe(formId)
    r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'retrieve',
        form: { formId },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )

    responseForm = r?.data

    expect(responseForm).toBeUndefined()
  })

  it('creates correctly with template', async () => {
    const r = await testUtils?.kaptionForms.queries.ManageForms.run(
      {
        _action: 'create',
        projectId,
        form: { userConfig: { formName: 'test' }, templateId: 'scratch' },
      },
      { bearer: testUtils.initialized?.user },
    )

    expect(r?.message).toMatchInlineSnapshot('"form created"')
    expect(r?.data?.userConfig?.formName).toBe('test')
    expect(r?.data?.templateId).toBe('scratch')
    const responseForm = r?.data

    formId = responseForm?.formId

    expect(snap(responseForm)).toMatchInlineSnapshot(`
      {
        "cards": [
          {
            "aside": [],
            "cardId": "[id:************************]",
            "choices": [
              "choice1",
              "choice2",
              "choice3",
            ],
            "config": {},
            "logic": [],
            "typeKey": "multipleChoice",
          },
        ],
        "config": {},
        "createdAt": "[dateTime:]",
        "createdByUserId": "[id:**************************]",
        "description": null,
        "formId": "[id:**]",
        "formName": "[name:****]",
        "name": null,
        "projectId": "[id:**************************]",
        "submissions": null,
        "templateId": "[id:*******]",
        "updatedAt": "[dateTime:]",
        "views": null,
      }
    `)
  })

  it('gets list of forms', async () => {
    if (!projectId)
      throw new Error('no projectId')

    const r = await testUtils?.kaptionForms.queries.FormsIndex.run(
      {
        _action: 'list',
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )

    expect(r?.message).toBeFalsy()
    expect(r?.status).toMatchInlineSnapshot('"success"')
    expect(r?.data).toBeDefined()
    expect(r?.data?.length).toBeGreaterThan(0)
    expect(snap(r?.data)).toMatchInlineSnapshot(`
      [
        {
          "cards": [
            {
              "aside": [],
              "cardId": "[id:************************]",
              "choices": [
                "choice1",
                "choice2",
                "choice3",
              ],
              "config": {},
              "logic": [],
              "typeKey": "multipleChoice",
            },
          ],
          "config": {},
          "createdAt": "[dateTime:]",
          "createdByUserId": "[id:**************************]",
          "description": null,
          "formId": "[id:**]",
          "formName": "[name:****]",
          "name": null,
          "projectId": "[id:**************************]",
          "submissions": null,
          "templateId": "[id:*******]",
          "updatedAt": "[dateTime:]",
          "views": null,
        },
      ]
    `)

    expect(r?.indexMeta?.count).toBe(1)
    expect(r?.indexMeta?.limit).toBe(20)
    expect(r?.indexMeta).toMatchInlineSnapshot(`
      {
        "count": 1,
        "limit": 20,
        "offset": 0,
      }
    `)
  })

  it('handles bulk delete', async () => {
    if (!projectId)
      throw new Error('no projectId')
    if (!formId)
      throw new Error('no formId')

    const r = await testUtils?.kaptionForms.queries.FormsIndex.run(
      {
        _action: 'delete',
        projectId,
        selectedIds: [formId],
      },
      { bearer: testUtils.initialized?.user },
    )

    expect(r?.message).toBe('1 deleted')

    expect(r?.data?.length).toBe(0)
  })
})
