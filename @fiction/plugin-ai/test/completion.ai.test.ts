import fs from 'node:fs'
import { FictionAws, FictionMedia } from '@fiction/core'
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

const pageSchemaJson = zodToJsonSchema(pageSchema)

describe('ai completions', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = await createTestUtils({ envFiles: [testEnvFile] })

  const openaiApiKey = testUtils.fictionEnv.var('OPENAI_API_KEY')

  const awsAccessKey = testUtils.fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = testUtils.fictionEnv.var('AWS_ACCESS_KEY_SECRET')
  const unsplashAccessKey = testUtils.fictionEnv.var('UNSPLASH_ACCESS_KEY')

  if (!awsAccessKey || !awsAccessKeySecret || !unsplashAccessKey)
    throw new Error(`missing env vars key:${awsAccessKey?.length}, secret:${awsAccessKeySecret?.length}, unsplash${unsplashAccessKey?.length}`)

  // const unsplashAccessKey = testUtils.fictionEnv.var('UNSPLASH_ACCESS_KEY')

  if (!openaiApiKey)
    throw new Error(`no openaiApiKey`)

  const fictionAws = new FictionAws({
    fictionEnv: testUtils.fictionEnv,
    awsAccessKey,
    awsAccessKeySecret,
  })
  const fictionMedia = new FictionMedia({
    fictionEnv: testUtils.fictionEnv,
    fictionDb: testUtils.fictionDb,
    fictionUser: testUtils.fictionUser,
    fictionServer: testUtils.fictionServer,
    fictionAws,
    bucket: 'factor-tests',
    unsplashAccessKey,
  })

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId || ''

  // const _fictionUnsplash = new FictionUnsplash({ ...testUtils, unsplashAccessKey })
  const fictionAi = new FictionAi({ ...testUtils, fictionMedia, openaiApiKey })

  const baseInstruction = webDesignBasePrompt

  it('gets a completion', async () => {
    const r2 = await fictionAi.queries.AiCompletion.serve({
      _action: 'completion',
      baseInstruction,
      objectives: {
        about: 'This is the website of Dean Stoecker, a successful tech mogul founder of alteryx, built to help market his autobiography book.',
        goal: 'The primary goal of this website is to sell the book, and secondary goal is get subscribers to email list',
        targetCustomer: 'The target customers are leaders,and  entrepreneurs  looking for inspiration and advice',
        targetAction: 'Encourage visitors buy book or subscribe to audience',
        imageStyle: 'Minimalistic, 3D model.',
      },
      outputFormat: pageSchemaJson,
      runPrompt: `Explain the benefits for homepage`,
      orgId,
      userId,
    }, { server: true })

    expect(r2.data?.completion).toMatchInlineSnapshot(`
      {
        "heading": "Discover the Blueprint to Transformative Success",
        "images": [
          {
            "url": "https://factor-tests.s3.amazonaws.com/org65dc38ccb49b491b6dbe1572/md_65dc38e50080d9d5b489c6f3-id_65dc38e598b2ca9ffdf03b05.png?blurhash=UBHnynoJ00xuD4oL0ORj00WBx%5Dof~Woy%3FZRk",
          },
        ],
        "subHeading": "Unveil the journey of a visionary who reshaped the tech landscape. Find not just inspiration but a mentor in these pages, guiding you to redefine your horizons.",
      }
    `)

    const r4 = await fictionAi.queries.AiCompletion.serve({
      _action: 'completion',
      baseInstruction,
      objectives: {
        about: 'This is the website of Kelly Powers, a well known biomedical device innovator in vascular access to market his consultancy named Madison River',
        goal: 'The goal of the website is to inform potential clients about experience and key insights, ultimately to help sell them on contracts or board positions',
        targetCustomer: 'The target customers medical device development companies of any size, particularly in vascular related fields',
        targetAction: 'Encourage visitors to subscrive to email list or set up a call',
        imageStyle: 'Cutting-edge technology with a cyberpunk vibe. Clean and minimal. Super Simple!!',
      },
      outputFormat: pageSchemaJson,
      runPrompt: `Explain the benefits for homepage`,
      orgId,
      userId,
    }, { server: true })

    expect(r4.data?.completion).toMatchInlineSnapshot(`
      {
        "heading": "Unlocking Innovation in Vascular Access",
        "images": [
          {
            "url": "https://factor-tests.s3.amazonaws.com/org65dc38ccb49b491b6dbe1572/md_65dc38fffeeb05169e308c96-id_65dc38ffe3327067e2734fed.png?blurhash=UCBqSTuPO%5B%2534%3ArVMcIVMKRjIAads%3Axu-%3Bkq",
          },
        ],
        "subHeading": "Explore the future with a pioneer at the helm. Unleashing the untapped potential within your biomedical developments, one insight at a time.",
      }
    `)
  }, 90000)
})
