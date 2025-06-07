import type { Organization } from '@fiction/core'
import type { PostConfig } from '../post'
import type { TablePostConfig } from '../schema'
import { z } from 'zod/v4'

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
  : `First create a title prefixed with "(Example Title) " to clearly mark it as a suggestion. The topic should be ancillary to the brand's goal, but not directly related.
  Focus on a best practice, a trend, an analysis, an opinion piece, a how-to, etc... The title should be catchy, sharp, and intriguing. Use open loops, NLP, curiosity gaps, and SEO-friendly phrasing.
`}

${post.content ? `Existing: ${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}` : ''}

Brand Context:
${org.profile?.hero ? `Hero Title: ${org.profile?.hero}` : ''}
${org.profile?.headline ? `Brand Headline: ${org.profile?.headline}` : ''}
${org.profile?.summary ? `About Brand: ${org.profile.summary}` : ''}
${org.profile?.interests ? `Interests: ${org.profile.interests.join(', ')}` : ''}
${org.profile?.influences ? `Influences: ${org.profile.influences.join(', ')}` : ''}
${org.profile?.pillars ? `Pillars: ${org.profile.pillars.join(', ')}` : ''}


CRITICAL STYLE GUIDE:
${org.prompt?.content || ''}
- Be concise, less is more. If in doubt, cut it out.
- Avoid jargon and overly technical/verbose wording
- Avoid cliches and overused phrases
- Use active voice and strong verbs
- Use specific examples and sharp, concrete language

IMAGES:
- Subject descriptions should be specific and diverse, avoiding repetition across posts. Focus on nouns and non-cliche subjects.
- When creating image URLs use the format example: [@image_url subject="a airplane taking off" orientation="landscape"] (orientation can be landscape, squarish, or portrait)
- For subject, use specific characters, objects, or scenes. Keep positive, and vary the subject. Creative analogies, simple concepts. Interesting is more important than literal.
- Add style information in subject if it helps clarify the point.
- Generally, keep images positive, emotive, engaging, creative, non-cliche, favor abstract, surreal, or conceptual over literal.
- Avoid vague terms that are hard to visualize, instead use specific nouns and adjectives to demonstrate a relevant point`

  const contentGuideline = 'Generate an outline using standard entry HTML formatting (h3 for body headers, p, etc.). Write 2 to 4 compelling headers that outline the beats. For body text, create explicit placeholders like: "<p class="placeholder">(CONTENT PLACEHOLDER: Share a personal experience related to this topic)</p>" to clearly indicate filler text that needs replacement. Each placeholder should provide specific guidance for what kind of content should fill that section.'

  const schema = mode === 'full'
    ? z.object({
        title: z.string().min(5).max(100).describe('Start with "(Example Title) " followed by a 3 to 8 word catchy, sharp, intriguing title. Use open loops, NLP, curiosity gaps, and SEO-friendly phrasing.'),
        subTitle: z.string().min(5).max(200).describe('A short, catchy subtitle that complements the title and provides additional context.'),
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

export function getSamplePost(args: {
  mode?: 'outline' | 'full'
  prefix?: string
  count?: number
} = {}): Partial<TablePostConfig> {
  const { mode = 'full', prefix = 'Sample', count = 1 } = args
  const now = new Date().toISOString()

  const baseContent = {
    title: `${prefix} Post ${count}`,
    subTitle: 'A simple sample post for demonstration purposes',
    dateAt: now,
    updatedAt: now,
    tags: ['sample', 'content'],
    categories: ['Samples'],
  }

  if (mode === 'outline') {
    return {
      ...baseContent,
      content: `<h2>Introduction</h2><p>This is a sample outline.</p><h2>Key Points</h2><ul><li>First point</li><li>Second point</li><li>Third point</li></ul><h2>Conclusion</h2><p>Sample conclusion.</p>`,
    }
  }

  return {
    ...baseContent,
    content: `<h2>Introduction</h2><p>This is a sample post created for demonstration purposes.</p><h2>Main Content</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl. Sed vitae purus ac risus finibus feugiat.</p><p>Donec et ligula et libero lacinia volutpat sit amet non risus. Vestibulum imperdiet, eros ut pretium convallis, ipsum nisl tempor purus, sed consequat nibh tortor a dui.</p><h2>Conclusion</h2><p>Thank you for reading this sample post.</p>`,
  }
}
