import fs from 'node:fs'
import { FictionAws, FictionMedia, getEnvVars } from '@fiction/core'
import { createTestUtils, testEnvFile } from '@fiction/core/test-utils'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { FictionAi } from '..'

const pageSchema = z.object({
  heading: z.string().min(18).max(60).describe('The heading for the page'),
  subHeading: z.string().min(48).max(150).describe('The sub heading underneath the heading'),
  images: z.array(z.object({ url: z.string() })).min(1).max(3).describe('The splash image url, landscape'),
})

type CompletionType = z.infer<typeof pageSchema>

const pageSchemaJson = zodToJsonSchema(pageSchema)

describe('ai completions', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] })

  const v = getEnvVars(testUtils.fictionEnv, [
    'AWS_ACCESS_KEY',
    'AWS_ACCESS_KEY_SECRET',
    'UNSPLASH_ACCESS_KEY',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'AWS_BUCKET_MEDIA',
  ] as const)

  const { awsAccessKey, awsAccessKeySecret, unsplashAccessKey, openaiApiKey, awsBucketMedia, anthropicApiKey } = v

  if (!openaiApiKey)
    throw new Error(`no openaiApiKey`)

  const fictionAws = new FictionAws({ fictionEnv: testUtils.fictionEnv, awsAccessKey, awsAccessKeySecret })
  const fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia, unsplashAccessKey })

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId || ''

  // const _fictionUnsplash = new FictionUnsplash({ ...testUtils, unsplashAccessKey })
  const fictionAi = new FictionAi({ ...testUtils, fictionMedia, openaiApiKey, anthropicApiKey })

  it('gets a website copy completion', async () => {
    const r4 = await fictionAi.queries.AiCompletion.serve({
      _action: 'completion',
      format: 'websiteCopy',
      objectives: {
        about: 'This is the website of Jane Smith, a well known designer and influencer in the fashion industry. She is known for her unique style and innovative designs.',
        imageStyle: 'Cutting-edge technology with a cyberpunk vibe. Clean and minimal. Super Simple!!',
      },
      outputFormat: pageSchemaJson,
      runPrompt: `Explain the benefits for homepage`,
      orgId,
      userId,
    }, { server: true })

    const completion = r4.data?.completion as CompletionType
    expect(Object.keys(completion || {}).sort()).toStrictEqual(['heading', 'images', 'subHeading'])

    expect(Object.keys(completion?.images?.[0] || {}).sort()).toStrictEqual(['url'])

    expect(r4.data?.completion).toMatchInlineSnapshot(`
      {
        "heading": "Elevate Your Style with Jane Smith's Vision",
        "images": [
          {
            "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724556210/arpowers_minimal_midshot_photo_of_object_futuristic_ancient_gre_f7c28b0f-3148-44fe-927f-b0fe57460f6c_cwyamv.png",
          },
          {
            "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724556206/arpowers_minimal_midshot_photo_of_object_ancient_greek_ideal_be_c954fed0-a698-4b95-8470-e8a0541b0b55_qkrjxn.png",
          },
        ],
        "subHeading": "Discover innovative fashion designs that blend cutting-edge trends with timeless elegance. Transform your wardrobe and express your unique personality through Jane's signature creations.",
      }
    `)
  }, 90000)

  it('gets a autocomplete completion', async () => {
    const r4 = await fictionAi.queries.AiCompletion.serve({
      _action: 'completion',
      format: 'contentAutocomplete',
      objectives: {
        previousText: 'It was crazy what happened next. One moment',
        title: 'The Eye of the Storm',
        description: 'How I narrowly escaped the storm of the century.',
      },
      runPrompt: `Create content suggestions`,
      orgId,
      userId,
    }, { server: true })

    const completion = r4.data?.completion as CompletionType
    expect(Object.keys(completion || {}).sort()).toStrictEqual(['suggestion1', 'suggestion2'])

    expect(r4.data?.completion).toMatchInlineSnapshot(`
      {
        "suggestion1": "everything was calm, then chaos erupted",
        "suggestion2": "the sky turned an ominous shade of green",
      }
    `)
  }, 90000)
})
