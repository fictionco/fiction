/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { snap } from '@factor/api'
import { beforeAll, describe, expect, it } from 'vitest'

import type { FictionTestUtils } from '../../utils/testUtils'
import { createFictionTestUtils } from '../../utils/testUtils'
import { RenderImage } from '../model'

type CurrentTestUtils = FictionTestUtils
let testUtils: CurrentTestUtils | undefined
let organizationId: string | undefined
let userId: string | undefined

describe('image handling', () => {
  beforeAll(async () => {
    testUtils = await createFictionTestUtils({ initialize: true })

    organizationId = testUtils.factorUser.activeOrganizationId.value
    userId = testUtils.factorUser.activeUser.value?.userId
  })

  it('creates an image', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    const img = new RenderImage({
      organizationId,
      userId,
      fictionModel: testUtils.fictionModel,
      url: 'https://www.test.com/hello',
    })

    const r = await testUtils.fictionModel.requests.ManageImage.projectRequest({
      _action: 'create',
      imageConfig: img.toConfig(),
    })

    expect(r.data?.imageId).toBeTruthy()

    expect(snap(r.data)).toMatchInlineSnapshot(`
      {
        "alt": null,
        "aspect": null,
        "blurhash": null,
        "createdAt": "[dateTime:]",
        "description": null,
        "extension": null,
        "filename": null,
        "height": null,
        "imageId": "[id:*******************]",
        "isPrivate": null,
        "meta": {},
        "mimetype": null,
        "modelId": null,
        "organizationId": "[id:**************************]",
        "renderConfig": null,
        "renderId": null,
        "showcaseStatus": null,
        "size": null,
        "status": null,
        "statusDetails": null,
        "title": null,
        "updatedAt": "[dateTime:]",
        "url": "https://www.test.com/hello",
        "userId": "[id:**************************]",
        "width": null,
      }
    `)

    const r2 = await testUtils.fictionModel.requests.ManageLikes.projectRequest(
      {
        _action: 'like',
        imageId: r.data?.imageId as string,
      },
    )

    expect(snap(r2.data)).toMatchInlineSnapshot(`
      {
        "createdAt": "[dateTime:]",
        "imageId": "[id:*******************]",
        "isLiked": "true",
        "updatedAt": "[dateTime:]",
        "userId": "[id:**************************]",
      }
    `)

    const r3 = await testUtils.fictionModel.requests.ManageImage.projectRequest(
      {
        _action: 'retrieve',
        imageConfig: { imageId: r.data?.imageId as string },
      },
    )

    expect(r3.data?.isLiked).toBe(true)

    expect(snap(r3.data)).toMatchInlineSnapshot(`
      {
        "alt": null,
        "aspect": null,
        "author": {
          "createdAt": "[dateTime:]",
          "email": "[email:********+**********@*****.***]",
          "emailVerified": "true",
          "geo": {
            "cityName": "[name:****** *****]",
            "countryCode": "[hash:**]",
            "ip": "",
            "ipOrganization": "Cloudflare WARP",
            "latitude": "[geo:-**.****]",
            "longitude": "[geo:-**.****]",
            "regionName": "[name:****** ***** *.*.]",
            "timezone": "America/Argentina/Buenos_Aires",
          },
          "lastSeenAt": "[dateTime:]",
          "organizations": [
            {
              "apiSecret": null,
              "avatarUrl": null,
              "config": null,
              "createdAt": "[dateTime:]",
              "customer": null,
              "customerAuthorized": null,
              "customerId": null,
              "customerIdTest": null,
              "customerTest": null,
              "dashboards": null,
              "lastSeenAt": "[dateTime:]",
              "memberCount": "1",
              "members": [
                {
                  "email": "[email:********+**********@*****.***]",
                  "fullName": null,
                  "lastSeenAt": "[dateTime:]",
                  "memberAccess": "owner",
                  "memberStatus": "active",
                  "userId": "[id:**************************]",
                },
              ],
              "meta": null,
              "onboard": null,
              "organizationEmail": "[email:********+**********@*****.***]",
              "organizationId": "[id:**************************]",
              "organizationName": "[name:********+**********]",
              "organizationPlan": null,
              "organizationStatus": "active",
              "ownerId": "[id:**************************]",
              "relation": {
                "email": "[email:********+**********@*****.***]",
                "fullName": null,
                "lastSeenAt": "[dateTime:]",
                "memberAccess": "owner",
                "memberStatus": "active",
                "userId": "[id:**************************]",
              },
              "specialPlan": null,
              "timezone": null,
              "updatedAt": "[dateTime:]",
              "username": null,
            },
          ],
          "role": "subscriber",
          "status": "active",
          "updatedAt": "[dateTime:]",
          "userId": "[id:**************************]",
        },
        "blurhash": null,
        "createdAt": "[dateTime:]",
        "description": null,
        "extension": null,
        "filename": null,
        "height": null,
        "imageId": "[id:*******************]",
        "isLiked": "true",
        "isPrivate": null,
        "meta": {},
        "mimetype": null,
        "modelId": null,
        "organizationId": "[id:**************************]",
        "renderConfig": null,
        "renderId": null,
        "showcaseStatus": null,
        "size": null,
        "status": null,
        "statusDetails": null,
        "title": null,
        "updatedAt": "[dateTime:]",
        "url": "https://www.test.com/hello",
        "userId": "[id:**************************]",
        "width": null,
      }
    `)
  })
})
