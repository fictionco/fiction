import { colorThemeBright } from '@fiction/core'
import { z } from 'zod'

const ARCHETYPE_VALUES = [
  'sage',
  'hero',
  'creator',
  'explorer',
  'rebel',
  'magician',
  'regular',
  'lover',
  'caregiver',
  'jester',
  'ruler',
  'innocent',
] as const

export const brandArchetypes: { label: string, value: typeof ARCHETYPE_VALUES[number], description: string }[] = [
  {
    label: 'Sage',
    value: 'sage',
    description: 'Shares wisdom and deep insights. Examples: Neil deGrasse Tyson, Brené Brown - focused on empowering others through knowledge and understanding.',
  },
  {
    label: 'Hero',
    value: 'hero',
    description: 'Overcomes personal challenges to inspire others. Examples: David Goggins, Simone Biles - sharing authentic struggles and triumphs to motivate transformation.',
  },
  {
    label: 'Creator',
    value: 'creator',
    description: 'Innovates and expresses unique ideas. Examples: Casey Neistat, Issa Rae - turning personal creativity into impactful content and projects.',
  },
  {
    label: 'Explorer',
    value: 'explorer',
    description: 'Seeks growth through new experiences. Examples: Anthony Bourdain, Jane Goodall - sharing discoveries and insights from personal journeys.',
  },
  {
    label: 'Rebel',
    value: 'rebel',
    description: 'Challenges status quo through authentic voice. Examples: Malcolm Gladwell, Gary Vaynerchuk - disrupting conventional wisdom with fresh perspectives.',
  },
  {
    label: 'Magician',
    value: 'magician',
    description: 'Facilitates personal transformation. Examples: Tony Robbins, Marie Kondo - guiding others to unlock their potential through expertise.',
  },
  {
    label: 'Regular',
    value: 'regular',
    description: 'Connects through relatable authenticity. Examples: Jennifer Garner, Chrissy Teigen - building trust by sharing genuine everyday experiences.',
  },
  {
    label: 'Lover',
    value: 'lover',
    description: 'Builds deep emotional connections. Examples: Michelle Obama, Tom Hanks - inspiring through vulnerability and genuine care.',
  },
  {
    label: 'Caregiver',
    value: 'caregiver',
    description: 'Empowers through support and guidance. Examples: Malala Yousafzai, Fred Rogers - leading with empathy and service to others.',
  },
  {
    label: 'Jester',
    value: 'jester',
    description: 'Uses humor to deliver value. Examples: Ryan Reynolds, Mindy Kaling - making meaningful connections through entertainment and wit.',
  },
  {
    label: 'Ruler',
    value: 'ruler',
    description: 'Leads through expertise and standards. Examples: Anna Wintour, Gordon Ramsay - building authority through mastery and high expectations.',
  },
  {
    label: 'Innocent',
    value: 'innocent',
    description: 'Inspires through authentic optimism. Examples: Dolly Parton, Emma Watson - sharing genuine positivity and values-driven content.',
  },
]

const BrandItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  examples: z.string().optional(),
})

export type BrandItem = z.infer<typeof BrandItemSchema>

const BrandItemsSchema = z.array(BrandItemSchema).optional()

export const BrandGuideSchemaV3 = z.object({
  vision: z.string().optional().describe('Core purpose and future direction'),
  personality: BrandItemsSchema.describe('Brand archetypes and traits'),
  // voice: BrandItemsSchema.describe('Communication styles and tone'),
  pillars: BrandItemsSchema.describe('Core content themes'),
  // motifs: BrandItemsSchema.describe('Recurring motifs and elements'),
  audience: BrandItemsSchema.describe('Target audience archetypes'),
  constraints: BrandItemsSchema.describe('Things to avoid'),
  colors: z.object({
    primary: z.enum(colorThemeBright).optional(),
    secondary: z.enum(colorThemeBright).optional(),
    accent: z.enum(colorThemeBright).optional(),
  }).optional(),
})

export type BrandGuideV3 = z.infer<typeof BrandGuideSchemaV3>

export type BrandGuideArrayKeys = 'personality' | 'pillars' | 'audience' | 'constraints'

export const BrandGuideSchema = z.object({
  personality: z.object({
    archetype: z.enum(ARCHETYPE_VALUES).optional().describe('Select your core personal archetype that authentically reflects your natural way of connecting with others'),
    traits: z.string().optional().describe('distinctive personality traits that make your personal brand uniquely you'),
    voice: z.object({
      tone: z.string().optional().describe('Your authentic communication style and how you naturally express yourself to your audience'),
      guidelines: z.string().optional().describe('Specific examples of language, phrases, and communication approaches that reflect your personal brand voice'),
    }).optional(),
  }).optional(),

  purpose: z.object({
    mission: z.string().optional().describe('Your core motivation for building a personal brand - what drives you to share and serve others'),
    vision: z.string().optional().describe('The lasting impact you want your personal brand to have on your audience and industry'),
    positioning: z.string().optional().describe('Your unique perspective or approach that sets you apart in your field'),
    values: z.array(z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      inPractice: z.string().optional().describe('Specific examples of how you demonstrate this value through your content and interactions'),
    })).optional().describe('Core personal values that guide your decisions and content creation'),
  }).optional(),

  communities: z.array(z.object({
    name: z.string().optional().describe('Specific segment of your audience with shared characteristics'),
    interests: z.string().optional().describe('Specific topics and themes that deeply matter to this audience segment'),
    challenges: z.string().optional().describe('Real pain points and obstacles this audience faces that you can help solve'),
    content: z.string().optional().describe('Content formats and topics proven to resonate with this specific audience'),
  })).optional(),

  pillars: z.array(z.object({
    topic: z.string().optional().describe('Key area of expertise or value you consistently deliver'),
    description: z.string().optional().describe('How this content theme serves your audience and supports your mission'),
    examples: z.string().optional().describe('Specific content ideas and formats that showcase your expertise in this area'),
    audiences: z.string().optional().describe('Which audience segments this content pillar primarily serves'),
  })).optional(),

  futurePacing: z.object({
    declaration: z.string().optional().describe('Powerful vision of your evolved personal brand written as if already achieved - be specific and ambitious'),
    nextSteps: z.array(z.object({
      statement: z.string().optional().describe('Specific milestone or achievement needed to realize your vision'),
      action: z.string().optional().describe('Clear, measurable action you will take to reach this milestone'),
      deadline: z.string().optional().describe('Realistic but ambitious timeframe for completing this action'),
    })).optional(),
  }).optional().describe('Strategic roadmap for evolving your personal brand with clear actions and accountability'),

  visuals: z.object({
    primaryColor: z.enum(colorThemeBright).optional().describe('Signature color that reflects your personal brand personality'),
    typography: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
    imageStyle: z.string().optional().describe('Guidelines for visual content that authentically represents your personal brand'),
  }).optional(),

  systemMessage: z.string().optional().describe('Detailed instructions for maintaining consistency in your personal brand voice across all content'),

  version: z.string().default('1.0.0').optional().describe('Version number for tracking evolution of your personal brand guidelines'),
}).optional().describe('Comprehensive personal brand strategy framework for authentic content creation and brand growth')

export type BrandGuide = z.infer<typeof BrandGuideSchema>
