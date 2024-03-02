/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { objectId, snap } from '@factor/api'
import type { FictionTestUtils } from '../../utils/testUtils'
import { createFictionTestUtils } from '../../utils/testUtils'
import { Collection } from '../model'

type CurrentTestUtils = FictionTestUtils
let testUtils: CurrentTestUtils | undefined
let organizationId: string | undefined
let userId: string | undefined
let collection: Collection | undefined
describe('collection handling', () => {
  beforeAll(async () => {
    testUtils = await createFictionTestUtils({ initialize: true })

    organizationId = testUtils.factorUser.activeOrganizationId.value
    userId = testUtils.factorUser.activeUser.value?.userId
  })

  it('creates a collection', async () => {
    if (!testUtils || !organizationId)
      throw new Error('missing items')

    collection = new Collection({
      organizationId,
      userId,
      fictionModel: testUtils.fictionModel,
      title: 'collection title',
      description: 'collection description',
      slug: 'hello-world',
    })

    const config = collection.toConfig()

    const r
      = await testUtils.fictionModel.requests.ManageCollection.projectRequest({
        _action: 'create',
        config,
      })

    expect(r.data?.collectionId).toBeTruthy()

    expect(r.data?.title).toEqual('collection title')
    expect(r.data?.description).toEqual('collection description')
    expect(r.data?.slug).toEqual('hello-world')

    expect(snap(r.data)).toMatchInlineSnapshot(`
      {
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
        "collectionId": "[id:***********************]",
        "collectionName": null,
        "createdAt": "[dateTime:]",
        "description": "collection description",
        "isPrivate": false,
        "media": [],
        "meta": null,
        "organizationId": "[id:**************************]",
        "slug": "hello-world",
        "title": "collection title",
        "updatedAt": "[dateTime:]",
        "userId": "[id:**************************]",
      }
    `)
  })

  it('updates a collection', async () => {
    if (!testUtils || !organizationId || !collection)
      throw new Error('missing items')

    const r
      = await testUtils.fictionModel.requests.ManageCollection.projectRequest({
        _action: 'update',
        config: {
          description: 'updated description',
          collectionId: collection.collectionId,
        },
      })

    expect(r.data?.collectionId).toBeTruthy()
    expect(r.data?.description).toBe('updated description')
  })

  it('add image and retrieves a collection', async () => {
    if (!testUtils || !organizationId || !collection)
      throw new Error('missing items')

    const req = testUtils.fictionModel.requests

    const { userId } = testUtils.factorUser?.activeUser.value ?? {}

    const r2 = await req.ManageImage.projectRequest({
      _action: 'create',
      imageConfig: {
        title: 'first',
        imageId: objectId(),
        organizationId,
        userId,
        url: '#',
      },
    })

    const r3 = await req.ManageImage.projectRequest({
      _action: 'create',
      imageConfig: {
        title: 'last',
        imageId: objectId(),
        organizationId,
        userId,
        url: '#',
      },
    })

    await req.ManageLikes.projectRequest({
      _action: 'like',
      imageId: r2.data?.imageId as string,
    })

    const r = await req.ManageCollection.projectRequest({
      _action: 'addMedia',
      config: { collectionId: collection.collectionId },
      imageIds: [r2.data?.imageId, r3.data?.imageId] as string[],
    })

    expect(snap(r.data)).toMatchInlineSnapshot(`undefined`)
  })

  it('deletes collection', async () => {
    const r
      = await testUtils?.fictionModel.requests.ManageCollection.projectRequest({
        _action: 'delete',
        collectionIds: [collection?.collectionId as string],
      })

    expect(r?.message).toMatchInlineSnapshot(`undefined`)
  })
})
