import fs from 'node:fs'
import { FictionAws, FictionMedia, getEnvVars } from '@fiction/core'
import { createTestUtils, testEnvFile } from '@fiction/core/test-utils'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { FictionAi } from '..'
import { webDesignBasePrompt } from '../basePrompts'

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

  const baseInstruction = webDesignBasePrompt

  it('gets a completion', async () => {
    const r4 = await fictionAi.queries.AiCompletion.serve({
      _action: 'completion',
      baseInstruction,
      objectives: {
        about: 'This is the website of Jane Smith, a well known designer and influencer in the fashion industry, built to showcase her latest collection.',
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
            "url": "https://res.cloudinary.com/fiction-com-inc/video/upload/f_auto,q_auto/v1724639769/replicate-prediction-219495bpydrj00chhhxr130rdc_qgfa91.mp4",
          },
          {
            "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724441630/arpowers_minimal_stock_background_for_profile_photo_professiona_4becd944-10bc-44b4-969b-9a85b3885409_mv0js5.png",
          },
        ],
        "subHeading": "Discover a fusion of avant-garde design and timeless elegance in our latest collection, where fashion meets innovation.",
      }
    `)
  }, 90000)
})
