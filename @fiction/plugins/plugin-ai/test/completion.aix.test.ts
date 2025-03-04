import fs from 'node:fs'
import { FictionAws, FictionMedia, getEnvVars } from '@fiction/core'
import { createTestUtils, testEnvFile } from '@fiction/core/test-utils'
import { afterAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { FictionAi } from '..'

const pageSchema = z.object({
  title: z.string().min(18).max(60).describe('The title for the page'),
  subTitle: z.string().min(48).max(150).describe('The sub title underneath the title'),
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

  afterAll(() => testUtils.close())

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
    expect(Object.keys(completion || {}).sort()).toStrictEqual(['images', 'subTitle', 'title'])

    expect(Object.keys(completion?.images?.[0] || {}).sort()).toStrictEqual(['url'])

    expect(r4.data?.completion).toMatchInlineSnapshot(`
      {
        "images": [
          {
            "url": "/images/minimal-tech-fashion-workspace.jpg",
          },
          {
            "url": "/images/cyberpunk-fashion-design.jpg",
          },
          {
            "url": "/images/digital-fashion-innovation.jpg",
          },
        ],
        "subTitle": "Experience the fusion of cutting-edge design and timeless style, crafted to transform your digital presence into a powerful fashion statement",
        "title": "Redefining Fashion Through Digital Innovation",
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
    expect(Object.keys(completion || {}).sort()).toStrictEqual(['suggestion1'])

    expect(r4.data?.completion).toMatchInlineSnapshot(`
      {
        "suggestion1": "I was standing at the window when the tornado ripped through Main Street, tearing roofs from houses like tissue paper",
      }
    `)
  }, 90000)
})
