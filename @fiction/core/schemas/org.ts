import { z } from 'zod/v4'
import { ColorThemeBrightSchema } from '../utils'
import { MediaSchema } from './media'

const SocialAccountSchema = z.object({
  handle: z.string().optional(),
  followerCount: z.number().optional(),
})

export const SocialAccountsSchema = z.object({
  github: SocialAccountSchema.optional(),
  x: SocialAccountSchema.optional(),
  linkedin: SocialAccountSchema.optional(),
  facebook: SocialAccountSchema.optional(),
  crunchbase: SocialAccountSchema.optional(),
  instagram: SocialAccountSchema.optional(),
  youtube: SocialAccountSchema.optional(),
  pinterest: SocialAccountSchema.optional(),
  snapchat: SocialAccountSchema.optional(),
  tiktok: SocialAccountSchema.optional(),
  calendar: SocialAccountSchema.optional(),
  discord: SocialAccountSchema.optional(),
  reddit: SocialAccountSchema.optional(),
  twitch: SocialAccountSchema.optional(),
  patreon: SocialAccountSchema.optional(),
  substack: SocialAccountSchema.optional(),
  medium: SocialAccountSchema.optional(),
  whatsapp: SocialAccountSchema.optional(),
  telegram: SocialAccountSchema.optional(),
})

export type SocialPlatform = keyof z.infer<typeof SocialAccountsSchema>
export type SocialAccounts = z.infer<typeof SocialAccountsSchema>

export const BillingSchema = z.object({
  customerId: z.string().nullable().optional(), // allow null to unset
  customerIdTest: z.string().nullable().optional(), // allow null to unset
  plan: z.string().optional(),
  specialPlan: z.enum(['vip', 'npo']).optional(),
})

export const ProfileSchema = z.object({
  headline: z.string().optional().meta({ description: 'Sharp, direct 2-4 word positioning description. Usually placed as subtitle under a brand name. Avoid cliche words like "innovator", "expert" or "leader".' }),
  hero: z.string().min(5).max(160).optional().meta({ description: 'Concise 2-4 content value promise used in Hero element. What value users will get from the content or brand. Simple, catchy, and memorable. Avoid cliches and jargon. Example: Grow with Data, Master Barbecue Cooking, Learn the Movie Business.' }),
  summary: z.string().min(10).max(400).optional().meta({ description: 'Short 8-21 word bio suitable for personal brand, blog about section, and professional profiles. Example "I build products that matter. Currently exploring the intersection of AI and human creativity, one breakthrough at a time.' }),
  mission: z.string().optional().meta({ description: 'Sharp 5-15 word mission statement for the brand, describing its purpose and values. Strive for authenticity.' }),
  industry: z.string().optional().meta({ description: 'Industry or field of expertise (e.g., technology, healthcare, education)' }),
  clout: z.number().min(0).max(100).optional().meta({ description: 'Estimated score based on positions at known companies, education quality, location (US and wealthy countries higher), influence (followers, etc): 0(spam), 10(average), to 100(extremely influential)' }),
  goal: z.string().min(10).max(200).optional().meta({ description: 'Specific, 2-5 word objective for the personal brand, guiding content creation based on current project (e.g., Create Influence in MedTech, Get More Followers, Market My Book, Share Ideas on AI)' }),
  interests: z.array(z.string()).min(1).max(5).optional().meta({ description: 'Areas of interest (e.g., history, ai, ux-design, pottery, ecommerce)' }),
  influences: z.array(z.string()).min(1).max(3).optional().meta({ description: 'Specific people, characters influencing voice and style (e.g, steve-jobs, johnny-depp, cicero)' }),
  pillars: z.array(z.string()).min(0).max(5).optional().meta({ description: 'Niche topics for content creation (e.g., ai, mobile ux-design, ai-ecommerce)' }),
})

export type OrgProfile = z.infer<typeof ProfileSchema>

export const AiSettingsSchema = z.object({
  image: z.string().optional(),
  content: z.string().optional(),
})

export type OrgAiSettings = z.infer<typeof AiSettingsSchema>

export const BrandingSchema = z.object({
  logo: MediaSchema.optional(),
  icon: MediaSchema.optional(),
  primaryColor: ColorThemeBrightSchema.optional(),
})
export type OrgBranding = z.infer<typeof BrandingSchema>

export const GeoLocationSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
})

export type GeoLocation = z.infer<typeof GeoLocationSchema>

export const TrackingSchema = z.object({
  googleAnalyticsId: z.string().optional(),
})

export const OrgTokenSchema = z.object({
  api: z.string().optional().meta({ description: 'API access token for the organization' }),
}).loose()
