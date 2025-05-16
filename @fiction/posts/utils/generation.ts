import type { Organization } from '@fiction/core'
import type { PostConfig } from '../post'

import { z } from 'zod'

export function getGenerationParams(args: {
  post: PostConfig
  org: Organization
  mode: 'outline' | 'full'
}): { prompt: string, schema: z.ZodType<any> } {
  const { post, org, mode } = args

  const prompt = `
Create an outline for a post.

${post.title
  ? `The post title is: ${post.title}. The outline should follow logically from the title, and be relevant to the brand's goal.`
  : `First create a title. The topic should be ancillary to the brand's goal, but not directly related.
  Something timely, focus on a best practice, a trend, an analysis, an opinion piece, a how-to, etc... The title should be catchy, sharp, and intriguing. Use open loops, NLP, curiosity gaps, and SEO-friendly phrasing.
`}

${post.content ? `Existing: ${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}` : ''}

Brand Context:
${org.goal ? `Brand Goal: ${org.goal}` : ''}
${org.headline ? `Brand Headline: ${org.headline}` : ''}
${org.about ? `About Brand: ${org.about}` : ''}
${org.interests?.length ? `Interests: ${org.interests.join(', ')}` : ''}
${org.influences?.length ? `Influences: ${org.influences.join(', ')}` : ''}
${org.pillars?.length ? `Pillars: ${org.pillars.join(', ')}` : ''}


CRITICAL STYLE GUIDE:
${org.promptContent}
- Be concise, less is more. If in doubt, cut it out.
- Avoid jargon and overly technical/verbose wording
- Avoid cliches and overused phrases
- Use active voice and strong verbs
- Use specific examples and sharp, concrete language

IMAGES:
- Subject descriptions should be specific and diverse, avoiding repetition across posts.
- When creating image URLs use the format example: [@image_url subject="a airplane taking off" orientation="landscape"] (orientation can be landscape, squarish, or portrait)
- For subject, use specific characters, objects, or scenes that are relevant to the post. Keep positive, and vary the subject. Creative analogies, simple concepts.
- Add style information in subject if it helps clarify the point.
- Generally, keep images positive, emotive, engaging, creative, non-cliche, favor abstract, surreal, or conceptual over literal.
- Avoid vague terms that are hard to visualize, instead use specific nouns and adjectives to demonstrate a relevant point`

  const contentGuideline = 'Generate an outline using standard entry HTML formatting (h3 for body headers, p, etc.). Write 2 to 4 compelling headers that outline the beats. But rather than writing body text, add a placeholder like: "(Guidance: Share a personal experience related to this topic)" to encourage creator personalization. '
  const schema = mode === 'full'
    ? z.object({
        title: z.string().min(5).max(100).describe('A 3 to 8 word catchy, sharp, intriguing title for post. Use open loops, NLP, curiosity gaps, and SEO-friendly phrasing.'),
        content: z.string().min(1).max(500).describe(contentGuideline),
        media: z.object({
          url: z.string().url().describe(`Return a shortcode for URL example: [@image_url subject="a boulder rolling down a hill" orientation="squarish"] that will be replaced with the actual url.`),
          type: z.enum(['image']).describe('Type of media to be used in the post.'),
        }).optional().describe('Featured media for the post, typically landscape'),
      }).describe('Generate full post based on the provided context and guidelines.')
    : z.object({
        content: z.string().min(1).max(1000).describe(contentGuideline),
      }).describe('Generate outline for the post based on the provided context and guidelines.')
  return { prompt, schema }
}
