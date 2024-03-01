/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { snap } from '@factor/api'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import type { FictionTestUtils } from '../../utils/testUtils'
import { createFictionTestUtils } from '../../utils/testUtils'
import { Model, RenderImage } from '../model'

type CurrentTestUtils = FictionTestUtils
let testUtils: CurrentTestUtils | undefined
let organizationId: string | undefined
let userId: string | undefined
let renderId: string | undefined
const confirmMock = vi.fn(() => {
  return () => true
})

vi.stubGlobal('confirm', confirmMock)

// const dir = safeDirname(import.meta.url)

describe('render handling', () => {
  beforeAll(async () => {
    console.warn('2222', process.env.TEST_RUN_NO)
    testUtils = await createFictionTestUtils({ initialize: true })

    organizationId = testUtils.factorUser.activeOrganizationId.value
    userId = testUtils.factorUser.activeUser.value?.userId

    console.error('render handlingrender handling', organizationId)
  })

  it('creates a render', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    const m = new Model({
      modelId: 'test',
      organizationId,
      fictionModel: testUtils.fictionModel,
      templateConfig: { learningRate: 1e-6, seed: 1234, maxTrainSteps: 1000 },
      conceptsList: [
        { conceptId: 'abc123', instanceToken: 'test', classToken: 'test' },
      ],
    })

    await m.save()

    testUtils.fictionInstance.serverIsReady = async () => true
    testUtils.fictionInstance.ec2DescribeInstance = async () => {
      return {
        isStarting: false,
        isTerminated: false,
        isStopped: false,
        isStopping: false,
        isRunning: true,
        status: 'running',
        organizationId: 'example',
        instanceId: 'test',
        publicIp: 'test',
        publicDns: 'test',
        instanceState: 'running',
        instanceType: '#',
        ami: '#',
        secondsSinceLaunch: 100,
        startedAt: new Date(),
        additional: {},
      }
    }
    testUtils.fictionInstance.instanceServerRequest = async () => ({
      status: 'success',
    })

    const r = await testUtils.fictionModel.requests.ManageRender.projectRequest(
      {
        modelId: m.modelId.value,
        _action: 'create',
        renderConfig: {
          aspect: 'portrait',
          prompt: 'a [c] in a car.',
          negativePrompt: 'ugly',
          guidanceScale: 7.4,
          numInferenceSteps: 80,
          numOutputs: 2,
        },
        status: 'ready',
      },
    )

    expect(r.data?.modelId).toBeTruthy()
    expect(r.data?.renderId).toBeTruthy()
    expect(r.data?.status).toBe('ready')

    renderId = r.data?.renderId

    expect(snap(r.data)).toMatchInlineSnapshot(`
      {
        "completedAt": null,
        "createdAt": "[dateTime:]",
        "meta": null,
        "modelId": "[id:****]",
        "organizationId": "[id:**************************]",
        "renderConfig": {
          "aspect": "portrait",
          "guidanceScale": "7.4",
          "height": "768",
          "negativePrompt": "ugly",
          "numInferenceSteps": "80",
          "numOutputs": "2",
          "prompt": "a [c] in a car.",
          "width": "512",
        },
        "renderId": "[id:*******************]",
        "renderName": null,
        "requestedAt": "[dateTime:]",
        "startedAt": null,
        "status": "ready",
        "statusDetails": null,
        "updatedAt": "[dateTime:]",
        "userId": "[id:**************************]",
      }
    `)

    expect(snap(r.jobConfig)).toMatchInlineSnapshot(`
      {
        "completedAt": null,
        "completedUrl": null,
        "createdAt": "[dateTime:]",
        "description": null,
        "inputs": {
          "modelId": "[id:****]",
          "organizationId": "[id:**************************]",
          "renderConfig": {
            "aspect": "portrait",
            "guidanceScale": "7.4",
            "height": "768",
            "negativePrompt": "ugly",
            "numInferenceSteps": "80",
            "numOutputs": "2",
            "prompt": "a [c] in a car.",
            "width": "512",
          },
          "renderId": "[id:*******************]",
          "requestedAt": "[dateTime:]",
          "status": "ready",
          "userId": "[id:**************************]",
        },
        "instanceId": null,
        "jobId": "[id:*******************]",
        "jobType": "render",
        "message": "waiting to be processed",
        "meta": null,
        "modelId": "[id:****]",
        "organizationId": "[id:**************************]",
        "outputs": null,
        "percent": null,
        "processor": "aim",
        "progressId": "[id:******]",
        "renderId": "[id:*******************]",
        "requestedAt": "[dateTime:]",
        "startedAt": null,
        "status": "requested",
        "statusDetails": null,
        "title": "render images (2)",
        "updatedAt": "[dateTime:]",
        "userId": "[id:**************************]",
      }
    `)

    expect(r.jobConfig?.renderId).toBe(r.data?.renderId)
    expect(r.jobConfig?.modelId).toBe(r.data?.modelId)
    expect(r.jobConfig?.organizationId).toBe(r.data?.organizationId)
    expect(r.jobConfig?.userId).toBe(r.data?.userId)
    expect(r.jobConfig?.jobType).toBe('render')
    expect(r.jobConfig?.processor).toBe('aim')
    expect(r.jobConfig?.status).toBe('requested')
    expect(r.jobConfig?.title).toBeTruthy()
    expect(r.jobConfig?.createdAt).toBeTruthy()
    expect(r.jobConfig?.requestedAt).toBeTruthy()

    const url = 'https://www.test.com/hello.png'
    const img = new RenderImage({
      organizationId,
      userId,
      fictionModel: testUtils.fictionModel,
      url,
      renderId: r.data?.renderId,
      width: 100,
      height: 100,
      alt: 'hello',
      mimetype: 'image/png',
      status: 'ready',
    })

    const r3 = await testUtils.fictionModel.requests.ManageImage.projectRequest(
      {
        _action: 'create',
        imageConfig: img.toConfig(),
      },
    )

    await testUtils.fictionModel.requests.ManageLikes.projectRequest({
      _action: 'like',
      imageId: img.imageId,
    })

    expect(snap(r3.data)).toMatchInlineSnapshot(`
      {
        "alt": "hello",
        "aspect": null,
        "blurhash": null,
        "createdAt": "[dateTime:]",
        "description": null,
        "extension": null,
        "filename": null,
        "height": "100",
        "imageId": "[id:*******************]",
        "isPrivate": null,
        "meta": {},
        "mimetype": "image/png",
        "modelId": null,
        "organizationId": "[id:**************************]",
        "renderConfig": null,
        "renderId": "[id:*******************]",
        "showcaseStatus": null,
        "size": null,
        "status": "ready",
        "statusDetails": null,
        "title": null,
        "updatedAt": "[dateTime:]",
        "url": "https://www.test.com/hello.png",
        "userId": "[id:**************************]",
        "width": "100",
      }
    `)

    expect(r3.data?.imageId).toBeTruthy()
    expect(r3.data?.renderId).toBe(renderId)
    expect(r3.data?.organizationId).toBe(organizationId)
    expect(r3.data?.userId).toBe(userId)
    expect(r3.data?.url).toBe(url)
    expect(r3.data?.status).toBe('ready')
  })

  it('gets render list', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    const r = await testUtils.fictionModel.requests.QueryRenders.projectRequest(
      {
        limit: 5,
      },
    )

    expect(r.data?.length).toBe(1)
    expect(r.data?.map(_ => _.renderId)[0]).toBe(renderId)
    const image = r.data?.[0].images?.[0]
    expect(image?.imageId).toBeTruthy()
    expect(image?.renderId).toBe(renderId)
    expect(image?.organizationId).toBe(organizationId)
    expect(image?.userId).toBe(userId)
    expect(image?.url).toBeTruthy()
    expect(image?.isLiked).toBe(true)
    expect(snap(r.data)).toMatchInlineSnapshot(`
      [
        {
          "completedAt": null,
          "createdAt": "[dateTime:]",
          "images": [
            {
              "alt": "hello",
              "aspect": null,
              "blurhash": null,
              "createdAt": "[dateTime:]",
              "description": null,
              "extension": null,
              "filename": null,
              "height": "100",
              "imageId": "[id:*******************]",
              "isLiked": "true",
              "isPrivate": null,
              "meta": {},
              "mimetype": "image/png",
              "modelId": null,
              "organizationId": "[id:**************************]",
              "renderConfig": null,
              "renderId": "[id:*******************]",
              "showcaseStatus": null,
              "size": null,
              "status": "ready",
              "statusDetails": null,
              "title": null,
              "updatedAt": "[dateTime:]",
              "url": "https://www.test.com/hello.png",
              "userId": "[id:**************************]",
              "width": "100",
            },
          ],
          "meta": null,
          "modelId": "[id:****]",
          "organizationId": "[id:**************************]",
          "renderConfig": {
            "aspect": "portrait",
            "guidanceScale": "7.4",
            "height": "768",
            "negativePrompt": "ugly",
            "numInferenceSteps": "80",
            "numOutputs": "2",
            "prompt": "a [c] in a car.",
            "width": "512",
          },
          "renderId": "[id:*******************]",
          "renderName": null,
          "requestedAt": "[dateTime:]",
          "startedAt": null,
          "status": "ready",
          "statusDetails": null,
          "updatedAt": "[dateTime:]",
          "userId": "[id:**************************]",
        },
      ]
    `)
  })
})
