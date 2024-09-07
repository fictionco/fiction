import { shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Card } from '../card'
import { Site } from '../site'
import { createSiteTestUtils } from './testUtils'

describe('cardCompletion', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })
  it('generates the content for the card', async () => {
    const card = new Card({ templateId: 'hero', site })

    card.genUtil.userPrompt.value = 'get the content for home page hero section'

    const r = await card.genUtil.getCompletion()

    expect(r).toMatchInlineSnapshot(`
      {
        "completion": {
          "choices": [
            {
              "finish_reason": "stop",
              "index": 0,
              "logprobs": null,
              "message": {
                "content": "{
        "heading": "Mastering Espionage & Intelligence",
        "subHeading": "Discover the world of elite intelligence services, crafted for the modern era's most challenging missions.",
        "superHeading": "Welcome to the Vanguard of Global Security",
        "actions": [
          {
            "name": "Explore Services",
            "href": "/services",
            "btn": "primary",
            "size": "large"
          },
          {
            "name": "Contact Now",
            "href": "/contact",
            "btn": "secondary",
            "size": "large"
          }
        ]
      }",
                "role": "assistant",
              },
            },
          ],
          "created": 1707776481,
          "id": "chatcmpl-8rYxtLFZbApt90Vg5DU4hXcAOCaM3",
          "model": "gpt-4-0125-preview",
          "object": "chat.completion",
          "system_fingerprint": "fp_f084bcfc79",
          "usage": {
            "completion_tokens": 125,
            "prompt_tokens": 406,
            "total_tokens": 531,
          },
        },
        "messages": [
          {
            "content": "follow these orders exactly and return JSON based on inputs provided: You are a world expert copywriter and web designer, create content for this website with the following reference info and objectives. Your content should:
           - Be elegant and concise, avoiding redundancy and excessive exclamations. Not cheesy, not cliche. Be creative. Don't push, pull.
           - Don't reuse the name of the site subject in the content. As its provided elsewhere.
           - Focus on the likely problems of the target customer, in the likely context they can be solved by the site creator.
           - Use an SEO-friendly approach without compromising the natural flow of information.
           For images, use shortcodes formatted as [stock_img search="(a prompt for image creation that will give a relevant and quality image)" orientation="(portrait or landscape or squarish)"], ensuring relevance to the content.",
            "role": "system",
          },
          {
            "content": "provide output in the format of this json schema: {"type":"object","properties":{"heading":{"type":"string","minLength":18,"maxLength":80},"subHeading":{"type":"string","minLength":30,"maxLength":150},"superHeading":{"type":"string"},"actions":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"href":{"type":"string"},"btn":{"type":"string"},"size":{"type":"string"}},"additionalProperties":false}}},"required":["heading","subHeading"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}.",
            "role": "system",
          },
          {
            "content": "objectives: About: This is a portfolio website for James Bond, a secret agent working for MI6.
      Goals: The main goal is educate potential clients about services and experience, provide social proof and testimonials
      Target Customer: The target customers government intelligence agencies, and similar agencies hiring secret agents
      Target Action: Encourage visitors to fill out a form, call, or email
      ",
            "role": "system",
          },
          {
            "content": "get the content for home page hero section",
            "role": "user",
          },
        ],
        "referenceInfo": "",
      }
    `)
  })
})
