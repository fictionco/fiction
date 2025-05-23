import type { LinkedInEnrichmentProfile } from './util'
import { ColorThemeBrightSchema } from '@fiction/core'
import { ArchetypeKeySchema, ImageStyleKeySchema } from '@fiction/core/schemas/motifs'

import { toJSONSchema, z } from 'zod/v4'

export const AiEnhancementSchema = z.object({
  headline: z.string().min(5).max(160).describe('Concise 2-4 positioning statement. Tagline suitable for hero headline, social media bio, and email signature. Simple, catchy, and memorable. Avoid cliche words like "innovator", "expert" or "leader".'),
  promise: z.string().min(5).max(160).describe('Concise 2-4 content value promise. What value users will get from the content. Simple, catchy, and memorable. Avoid cliches and jargon. Example: Grow with Data, Master Barbecue Cooking, Learn the Movie Business.'),
  about: z.string().min(10).max(400).describe('Short 10-30 word bio suitable for personal brand, blog about section, and professional profiles'),
  interests: z.array(z.string()).min(1).max(5).describe('Areas of interest (e.g., history, ai, ux-design, pottery, ecommerce)'),
  influences: z.array(z.string()).min(1).max(3).describe('Specific people, characters influencing voice and style (e.g, steve-jobs, johnny-depp, cicero)'),
  pillars: z.array(z.string()).min(0).max(5).describe('Niche topics for content creation (e.g., ai, mobile ux-design, ai-ecommerce)'),
  goal: z.string().min(10).max(200).describe('Specific, 2-5 word objective for the personal brand, guiding content creation based on current project (e.g., Create Influence in MedTech, Get More Followers, Market My Book, Share Ideas on AI)'),
  promptImageKey: ImageStyleKeySchema.optional().describe('Image style for the brand, based on influences and interests'),
  promptContentKey: ArchetypeKeySchema.optional().describe('Content style for the brand, based on influences and interests'),
  primaryColor: ColorThemeBrightSchema.optional().describe('Primary color for the brand'),
  clout: z.number().min(0).max(100).describe('Estimated score based on positions at known companies, education quality, location (US and wealthy countries higher), influence (followers, etc): 0(spam), 10(average), to 100(extremely influential)'),
})

export type AiEnhancement = z.infer<typeof AiEnhancementSchema>

const accountGenGuidelines = `
INSTRUCTIONS:
You are an expert identity consultant specializing in crafting authentic, impactful digital presences for professionals based on their LinkedIn data.

Use provided profile information (e.g., headline, summary, experience, education, skills, interests, location, connections, followers) to generate outputs that are concise, distinctive, and resonate with the user's professional identity.

Objectives
- Authenticity: Reflect the user's unique voice, expertise, and personality.
- Relevance: Predict preferences and interests based on LinkedIn data (location, industry, roles, education, connections).
- Impact: Create memorable, professional outputs that stand out in crowded digital spaces.
- Conciseness: Deliver sharp, specific content with minimal word count.
Output Structure
- Headline: 2-4 word position statement. Capturing unique professional value. Avoid jargon (e.g., "expert," "leader").
- Bio: 10-30 words in HTML, highlighting specific achievements and personality. Use vivid details, avoid buzzwords (e.g., "passionate," "innovative").
- Content Interests: 1-3 interests inferred from hobbies, experience, or background (e.g., sustainability, fitness, tech trends).
- Influences: 1-3 specific figures or styles shaping tone (e.g., Elon Musk, Marie Forleo, Bauhaus, Stoicism). Base on profile cues or industry trends.
- Content Pillars: 1-3 niche topics for content creation (e.g., AI ethics, fintech UX, green startups). Align with expertise and interests.
- Promise: 2-4 word content value promise. What users will gain from the content (e.g., "Mastering AI for Business"). Avoid cliches and jargon.
- Goal: 2-6 word measurable objective for personal brand (e.g., show my work portfolio, discuss movies and latest news). Align with current projects or aspirations.
- Clout Score: 0-100 based on:
    - Positions at legit companies, high-level work (+10-20).
    - Education quality (+5-15 for top-tier schools).
    - Location (+5-10 for US/wealthy countries).
    - Influence (+5-20 for high followers/connections).
    - Scale: 0 (spam), 10 (global average), 30 (US average), 50 (influential), 100 (highly influential).
- Image Style, Content Style, Primary Color: Pick based on influences and interests, pick randomly if not clear.
Core Principles
- Highlight genuine expertise with specific, verifiable details.
- Balance professionalism with distinctive personality traits.
- Transform vague claims into vivid, memorable specifics.
- Capture authentic voice in minimal words.
- Identify unique differentiators that set the user apart.
Writing Techniques
- Concrete Details: Use specific metrics or anecdotes (e.g., “Grew revenue 20% in 6 months” vs. “successful leader”).
- Tight Structure: Craft sentences with clear rhythm and purpose.
- Vivid Language: Choose unexpected verbs and precise nouns (e.g., “spearheaded” vs. “led”).
- Subtle Narrative: Weave micro-stories to spark interest (e.g., “Turned a failing app into a 5-star hit”).
- Evidence-Based: Ground claims in LinkedIn data (e.g., projects, endorsements).
Avoid
- Corporate buzzwords (e.g., “synergy,” “disruptor”).
- Generic clichés (e.g., “dedicated,” “team player”).
- Unsupported traits (e.g., “creative” without examples).
- Overused intros (e.g., “I'm a passionate…”).
- Obvious industry values (e.g., “I value integrity”).
- Self-proclaimed expertise without proof.
Advanced Techniques
- Psychographic Inference: Predict interests based on LinkedIn patterns:
- Location (e.g., San Francisco → tech, sustainability; London → finance, culture).
- Connections (e.g., following industry leaders → admiration for their style).
- Activity (e.g., shared articles → topical interests).
- Tone Matching: Mirror user's LinkedIn tone (e.g., formal for executives, conversational for creatives) while elevating clarity.
- Aspirational Framing: Present the user as their “best self,” aligning with career goals inferred from job history or skills.
- Cultural Nuances: Adjust for location-based norms (e.g., US: bold achievements; UK: understated competence).
- SEO Optimization: For post titles, use trending keywords from industry or LinkedIn activity (e.g., “Web3” for blockchain pros).
Output Goals
- Create profiles that feel “like them, but better” — instantly recognizable and polished.
- Develop bios that differentiate in competitive professional spaces.
- Balance industry relevance with bold, fresh approaches.
- Craft content that is authentic yet aspirational, sparking engagement.
- Predict preferences that align with the user's LinkedIn footprint and context.
Example Output
- Input: Software engineer, 5 years at Google, Stanford CS degree, San Francisco, 2k followers, shares AI articles, follows Satya Nadella.
- Output:
    - Headline: Code that Shapes Tomorrow
    - Bio: <p>Built AI tools at Google, boosting user engagement 15%. Stanford CS alum. Curious tinkerer crafting smarter systems.</p>
    - Content Interests: AI advancements, sci-fi, urban hiking
    - Influences: Satya Nadella, Blade Runner, minimalism
    - Content Pillars: AI scalability, tech ethics, developer productivity
    - Clout Score: 65 (Google role: +20, Stanford: +15, SF: +10, followers: +10, baseline: +10)
Notes
- If LinkedIn data is incomplete, make reasonable assumptions based on industry/location norms and flag uncertainties.
- For ambiguous profiles, lean toward broad but plausible interests (e.g., tech → innovation, leadership).
- If users request memory edits, instruct: “To forget a chat, click the book icon below the message and select the chat to remove. Disable memory in Settings > Data Controls.”
- Do not confirm memory modifications or generate images unless explicitly confirmed.
`

export function getGenerationParams(args: {
  linkedinData: LinkedInEnrichmentProfile
}): { prompt: string, schema: z.ZodType<any> } {
  const { linkedinData } = args
  return {
    prompt: `- Create account profile based on this data: ${JSON.stringify(linkedinData)} ${accountGenGuidelines}`,
    schema: AiEnhancementSchema,
  }
}
