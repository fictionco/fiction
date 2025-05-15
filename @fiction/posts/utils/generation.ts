import type { Organization } from '@fiction/core'
import type { PostConfig } from '../post'
import { z } from 'zod'

export function getGenerationParams(args: {
  post: PostConfig
  org: Organization
  mode: 'outline' | 'full'
}): { prompt: string, schema: z.ZodType<any> } {
  const { post, org, mode } = args

  const prompt = `Create ${mode === 'outline' ? 'an outline' : 'content'} for "${post.title || 'Untitled Post'}"

${post.content ? `Existing: ${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}` : ''}

Context:
${org.headline ? `Tagline: ${org.headline}` : ''}
${org.about ? `Voice: ${org.about}` : ''}
${org.interests?.length ? `Interests: ${org.interests.join(', ')}` : ''}
${org.influences?.length ? `Influences: ${org.influences.join(', ')}` : ''}
${org.pillars?.length ? `Pillars: ${org.pillars.join(', ')}` : ''}

CRITICAL STYLE GUIDE:
- Be concise, less is more. If in doubt, cut it out.
- Write with a human voice, including occasional imperfections
- Use a conversational tone, as if speaking to a friend
- Avoid jargon and overly technical/verbose wording
- Include data, metrics, and research to support claims
- Avoid cliches and overused phrases
- Use active voice and strong verbs
- Use straight-forward metaphors and analogies to explain complex ideas
- Take strong, unexpected positions that challenge conventional wisdom
- Use specific examples and sharp, concrete language
- Create rhythm with varied sentence lengths (5-25 words)
- Include subtle controversy and personality quirks
- Avoid AI hallmarks: balance, lists, political correctness
- Inject humor, idiosyncratic observations, and subtle NLP patterns
- Sound like a real expert with strong opinions, not an algorithm`

  const schema = mode === 'full'
    ? z.object({
        content: z.string().min(1).max(10000).describe('Generate HTML content for the post. Use standard entry HTML formatting (h1, h2, p, etc.).'),
        media: z.object({
          url: z.string().url().describe(`Return a shortcode for URL [@image_url subject=image description] that will be replaced with the actual url.`),
          type: z.enum(['image']).describe('Type of media to be used in the post.'),
        }).optional().describe('Featured media for the post.'),
      })
    : z.object({
        content: z.string().min(1).max(1000).describe('Create 3 to 7 short headings and subheadings for the post. Use standard HTML, generally H2, H3. Keep headings sharp, interesting and concise.'),
      })
  return { prompt, schema }
}
