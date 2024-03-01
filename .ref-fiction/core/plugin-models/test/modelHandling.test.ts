/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { safeDirname, snap } from '@factor/api'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import JSZip from 'jszip'
import fs from 'fs-extra'
import type express from 'express'
import type { FictionTestUtils } from '../../utils/testUtils'
import { createFictionTestUtils } from '../../utils/testUtils'
import type { FictionModel } from '..'
import { Model } from '../model'

const zip = new JSZip()
type CurrentTestUtils = FictionTestUtils & { fictionModel: FictionModel }
let testUtils: CurrentTestUtils | undefined
let organizationId: string | undefined

const confirmMock = vi.fn(() => {
  return () => true
})

vi.stubGlobal('confirm', confirmMock)

const dir = safeDirname(import.meta.url)

describe('model handling', () => {
  beforeAll(async () => {
    testUtils = await createFictionTestUtils({ initialize: true })

    organizationId = testUtils.factorUser.activeOrganizationId.value

    const imgData = fs.readFileSync(`${dir}/test.jpg`)

    zip.file('test.jpg', imgData)
    zip.file('test2.jpg', imgData)
  })

  it('creates a model', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    const m = new Model({
      fictionModel: testUtils.fictionModel,
      templateConfig: { learningRate: 1e-6, seed: 1234, maxTrainSteps: 1000 },
    })

    const conceptId = 'abc123'
    m.conceptsList.value = [
      { conceptId, instanceToken: 'test', classToken: 'test' },
    ]

    const files = [
      {
        fieldname: `zip-class-${conceptId}`,
        mimetype: 'application/zip',
        buffer: zipBuffer,
      },
      {
        fieldname: `zip-instance-${conceptId}`,
        mimetype: 'application/zip',
        buffer: zipBuffer,
      },
    ] as Express.Multer.File[]

    const r = await testUtils.fictionModel.queries.TrainModel.run(
      {
        modelConfig: JSON.stringify(m.toConfig()),
        organizationId,
        _action: 'train',
      },
      {
        bearer: testUtils.initialized?.user,
        request: { files } as express.Request,
      },
    )

    expect(snap(r.data)).toMatchInlineSnapshot(`
      {
        "authorId": null,
        "baseModel": "runwayml/stable-diffusion-v1-5",
        "completedAt": null,
        "conceptsList": [
          {
            "classDataZipUrl": "[url:*****://*******-*******.**.*********.***//******/************************/***-*****-******.***]",
            "classPrompt": "a photo of a test",
            "classToken": "[hash:****]",
            "conceptId": "[id:******]",
            "instanceDataZipUrl": "[url:*****://*******-*******.**.*********.***//******/************************/***-********-******.***]",
            "instancePrompt": "a photo of test test",
            "instanceToken": "[hash:****]",
            "meta": {
              "classDataFileSize": "4178",
              "instanceDataFileSize": "4178",
              "sampleImageUrls": [
                "[url:*****://*******-*******.**.*********.***//******/************************/***/****.***]",
                "[url:*****://*******-*******.**.*********.***//******/************************/***/*****.***]",
              ],
            },
          },
        ],
        "createdAt": "[dateTime:]",
        "description": null,
        "meta": null,
        "modelCheckpointUrl": null,
        "modelDiffusersZipUrl": null,
        "modelId": "[id:************************]",
        "modelName": null,
        "modelVersion": "1",
        "organizationId": "[id:**************************]",
        "requestedAt": "[dateTime:]",
        "status": "requested",
        "statusDetails": null,
        "templateConfig": {
          "learningRate": "0.000001",
          "maxTrainSteps": "1000",
          "seed": "1234",
        },
        "templateId": "[id:**********]",
        "thumbUrl": null,
        "updatedAt": "[dateTime:]",
        "userId": "[id:**************************]",
      }
    `)
  })

  // it("creates form via request", async () => {
  //   const scratchTemplate = templates.find(
  //     (t) => t.templateId.value === "scratch",
  //   )
  //   if (!scratchTemplate) throw new Error("scratch template not found")

  //   const r = await testUtils?.kaptionForms.requests.ManageForms.projectRequest(
  //     {
  //       _action: "create",
  //       form: { config: { formName: "hello" }, templateId: "scratch" },
  //     },
  //   )
  //   responseForm = r?.data
  //   expect(r?.message).toMatchInlineSnapshot('"form created"')
  //   expect(responseForm?.projectId?.length).toBeGreaterThan(10)
  //   expect(responseForm?.config?.formName).toBe("hello")
  //   modelId = responseForm?.formId
  //   expect(formId).toBeTruthy()
  //   expect(snap(responseForm)).toMatchInlineSnapshot(`
  //     {
  //       "cards": null,
  //       "config": null,
  //       "createdAt": "[dateTime:]",
  //       "createdByUserId": "[id:**************************]",
  //       "description": null,
  //       "formId": "[id:***]",
  //       "formName": null,
  //       "name": null,
  //       "projectId": "[id:**************************]",
  //       "submissions": null,
  //       "templateId": null,
  //       "updatedAt": "[dateTime:]",
  //       "config": {
  //         "formName": "[name:*****]",
  //       },
  //       "views": null,
  //     }
  //   `)
  // })

  // it("loads form based on formId param in route", async () => {
  //   if (!testUtils) throw new Error("testUtils not defined")

  //   await testUtils?.factorRouter.goto("formBuilder", { formId })

  //   const formState = testUtils?.kaptionForms.activeFormState
  //   const activeForm = testUtils?.kaptionForms.activeForm
  //   expect(activeForm.value).toMatchInlineSnapshot("undefined")

  //   expect(formState.value).toMatchInlineSnapshot(`
  //     {
  //       "data": undefined,
  //       "loading": Promise {},
  //       "status": "loading",
  //     }
  //   `)

  //   await formState.value.loading
  //   expect(formState.value.status).toMatchInlineSnapshot('"success"')
  //   expect(formState.value.data?.cards.value.length).toMatchInlineSnapshot("0")

  //   expect(activeForm.value).toBe(formState.value.data)
  // })

  // it("adds new cards", async () => {
  //   const form = testUtils?.kaptionForms.activeForm.value
  //   if (!form) throw new Error("form not defined")

  //   await form?.addNewElement("multipleChoice")

  //   expect(form.cards.value.length).toBe(1)
  // })

  // it("loads form index", async () => {
  //   if (!testUtils) throw new Error("testUtils not defined")

  //   await testUtils?.factorRouter.goto("formIndex")

  //   const formIndexState = testUtils?.kaptionForms.activeFormIndexState
  //   const activeFormIndex = testUtils?.kaptionForms.activeFormIndex

  //   expect(formIndexState.value).toMatchInlineSnapshot(`
  //     {
  //       "data": undefined,
  //       "loading": Promise {},
  //       "status": "loading",
  //     }
  //   `)

  //   await formIndexState.value.loading
  //   expect(formIndexState.value.status).toMatchInlineSnapshot('"success"')
  //   expect(formIndexState.value.data?.length).toMatchInlineSnapshot("1")

  //   expect(activeFormIndex.value).toBe(formIndexState.value.data)
  // })

  // it("updates a card in the form", () => {
  //   if (!testUtils) throw new Error("testUtils not defined")
  //   if (!responseForm) throw new Error("no responseform")

  //   const cardId =
  //     testUtils?.kaptionForms.activeForm.value?.cards.value?.[0].cardId

  //   expect(cardId).toBeTruthy()

  //   if (!cardId) throw new Error("no cardId")

  //   testUtils.kaptionForms.updateCardById(cardId, {
  //     config: { question: "test" },
  //   })
  // })

  // it("deletes input by id", () => {
  //   const form = testUtils?.kaptionForms.activeForm.value

  //   expect(form?.activeId.value).toBeTruthy()

  //   expect(form?.cards.value.length).toBe(1)

  //   expect(snap(form?.cards.value)).toMatchInlineSnapshot(`
  //     [
  //       {
  //         "cardId": "[id:************************]",
  //         "inputs": [
  //           {
  //             "inputId": "[id:************************]",
  //             "config": {
  //               "cardTypeKey": "multipleChoice",
  //             },
  //           },
  //         ],
  //         "config": {
  //           "title": "test",
  //         },
  //       },
  //     ]
  //   `)

  //   form?.deleteById([form?.activeId.value])

  //   expect(snap(form?.cards.value)).toMatchInlineSnapshot(`
  //     [
  //       {
  //         "cardId": "[id:************************]",
  //         "inputs": [],
  //         "config": {
  //           "title": "test",
  //         },
  //       },
  //     ]
  //   `)

  //   expect(form?.cards.value[0].config?.cards?.length).toBe(0)

  //   expect(form?.activeId.value).toBe(form?.cards.value[0].cardId)
  // })
})
