import { z } from 'zod/v4'

export function getPersonalBrandingGoals() {
  return [
    {
      value: 'portfolio',
      label: 'Show My Work',
      subLabel: 'Portfolio for clients and employers',
    },
    {
      value: 'career',
      label: 'Get Hired',
      subLabel: 'Resume and professional profile',
    },
    {
      value: 'business',
      label: 'Find Clients',
      subLabel: 'Services and contact info',
    },
    {
      value: 'personal',
      label: 'Share My Story',
      subLabel: 'Blog and personal updates',
    },
    {
      value: 'influence',
      label: 'Build Influence',
      subLabel: 'Ideas and thought leadership',
    },
    {
      value: 'investments',
      label: 'Attract Opportunities',
      subLabel: 'Ventures, partnerships and investments',
    },
  ] as const
}

export function getArchetypesStyles() {
  return [
    {
      value: 'hero',
      label: 'The Hero',
      subLabel: 'Bold, relentless, action-driven',
      info: 'Write bold, action-driven prose with short, vivid sentences to inspire courage and grit, Ernest Hemingway, Joan Didion, Hunter S. Thompson, David Sedaris',
    },
    {
      value: 'magician',
      label: 'The Magician',
      subLabel: 'Visionary, transformative, poetic',
      info: 'Craft visionary prose with vivid imagery and engaging narratives to shift perspectives, Neil Gaiman, Elizabeth Gilbert, Malcolm Gladwell, Ann Patchett',
    },
    {
      value: 'leader',
      label: 'The Leader',
      subLabel: 'Authoritative, commanding, polished',
      info: 'Use clear, confident sentences with a warm yet formal tone to convey leadership, James Baldwin, Ta-Nehisi Coates, Zadie Smith, Simon Sinek',
    },
    {
      value: 'lover',
      label: 'The Lover',
      subLabel: 'Passionate, sensory, connective',
      info: 'Write passionate, sensory prose with a conversational tone to forge emotional connections, Cheryl Strayed, David Sedaris, Ann Patchett, Brené Brown',
    },
    {
      value: 'rebel',
      label: 'The Rebel',
      subLabel: 'Defiant, witty, disruptive',
      info: 'Craft witty, defiant prose with sharp metaphors to challenge norms and inspire action, George Orwell, Chuck Palahniuk, Margaret Atwood, Seth Godin',
    },
    {
      value: 'sage',
      label: 'The Sage',
      subLabel: 'Wise, reflective, insightful',
      info: 'Write concise, reflective prose with clear insights to enlighten through calm wisdom, Malcolm Gladwell, Rebecca Solnit, Yuval Noah Harari, David Sedaris',
    },
  ] as const
}

export function getImageStyles() {
  return [
    {
      value: 'swissPrecision',
      label: 'Swiss Precision',
      subLabel: 'Structured Clarity',
      info: 'Ultra-minimal style with perfect grid alignment, crisp typography, and purposeful negative space. Reference: Josef Müller-Brockmann, International Typographic Style. Ideal for clear, authoritative brand communication.',
    },
    {
      value: 'digitalMinimalism',
      label: 'Digital Minimalism',
      subLabel: 'Modern Simplicity',
      info: 'Contemporary clean design with bold color fields, zero ornamentation, and perfect visual hierarchy. Influenced by Dieter Rams, Massimo Vignelli. Perfect for tech-forward personal brands seeking timeless legibility.',
    },
    {
      value: 'vectorEssence',
      label: 'Vector Essence',
      subLabel: 'Crisp Precision',
      info: 'Flawless curves and sharp edges with deliberate color blocking and perfect proportions. Reference: Saul Bass, Paul Rand. Excellent for instantly recognizable, scalable brand imagery.',
    },
    {
      value: 'constructedClarity',
      label: 'Constructed Clarity',
      subLabel: 'Purposeful Structure',
      info: 'Bold geometric compositions with strong directional flow and deliberate asymmetry. Reference: El Lissitzky, Constructivist principles. Creates impactful, immediately understandable visual statements.',
    },
    {
      value: 'essentialForm',
      label: 'Essential Form',
      subLabel: 'Pure Expression',
      info: 'Reduced to absolute essentials with perfect balance of positive/negative space and limited palette. Reference: Kazimir Malevich, Ludwig Mies van der Rohe. Communicates sophistication and intentionality.',
    },
    {
      value: 'inkDefinition',
      label: 'Ink Definition',
      subLabel: 'Precise Linework',
      info: 'Sharp black lines with pristine white space and masterful composition. Creates immediate visual impact with maximum legibility. Reference: Aubrey Beardsley, Milton Glaser. Perfect for conceptual clarity.',
    },
    {
      value: 'geometricBalance',
      label: 'Geometric Balance',
      subLabel: 'Harmonious Structure',
      info: 'Clean intersecting lines and primary shapes with mathematical precision and perfect color relationships. Reference: Piet Mondrian, De Stijl movement. Projects rational thinking and organizational clarity.',
    },
    {
      value: 'digitalFacets',
      label: 'Digital Facets',
      subLabel: 'Modern Precision',
      info: 'Contemporary low-poly style with clean faceted shapes, sharp edges, and subtle depth. Digital precision with architectural sensibility. Creates distinctive, memorable imagery with forward-thinking aesthetic.',
    },
  ] as const
}

const archetypeKeys = getArchetypesStyles().map(item => item.value)
const imageStyleKeys = getImageStyles().map(item => item.value)

export const ArchetypeKeySchema = z.enum([archetypeKeys[0], ...archetypeKeys.slice(1)])
export const ImageStyleKeySchema = z.enum([imageStyleKeys[0], ...imageStyleKeys.slice(1)])

export type ArchetypeKey = z.infer<typeof ArchetypeKeySchema>
export type ImageStyleKey = z.infer<typeof ImageStyleKeySchema>
