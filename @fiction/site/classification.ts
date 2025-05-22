import { z } from 'zod/v4'

const CardContentTypeSchema = z.enum([
  'text', // Text-driven content (articles, posts)
  'visual', // Image/video focused (more intuitive than 'media')
  'hybrid', // Balanced text/visual (clearer than 'mixed')
  'input', // User interaction focused (forms, comments)
  'stats', // Data visualization, metrics
  'detachable', //  Elements that can be removed from the main flow
  'detached', // Always detached from the main flow
])

/**
 * Core categories for component discovery
 */
const CardCategorySchema = z.enum([
  'essentials', // Basic building blocks (headers, text, buttons)
  'layout', // Structure (grids, containers, sections)
  'navigation', // Site structure (menus, breadcrumbs)
  'media', // Rich media (galleries, sliders, video)
  'forms', // User input (contact, signup, search)
  'content', // Display patterns (posts, cards, lists)
  'conversion', // Lead generation (email capture, CTAs)
  'social', // Community features (comments, sharing)
  'commerce', // Shopping (products, cart, checkout)
  'data', // Information display (tables, charts)
])

/**
 * Specific use cases for AI-driven generation
 */
const CardUseCaseSchema = z.enum([
  // Brand & Identity
  'about', // Company/personal intro
  'team', // Team/staff profiles
  'contact', // Contact information
  'services', // Service offerings

  // Marketing
  'feature', // Product/service highlights
  'pricing', // Pricing plans
  'comparison', // Product comparisons
  'testimonial', // Reviews and social proof
  'overview', // General information
  'faq', // Frequently asked questions
  'list', // Itemized content

  // Content
  'blog', // Blog posts/articles
  'portfolio', // Work showcase
  'case-study', // Detailed examples
  'tutorial', // How-to content

  // Journey
  'timeline', // History/progression
  'process', // Step-by-step flows
  'roadmap', // Future plans
  'milestone', // Key achievements
  'cv', // Resume/CV

  'conversion', // Email signup
  'subscribe', // Newsletter signupz
  'lead',
  'feedback', // User input/surveys
  'support', // Help desk/FAQ

  // Community
  'profile', // User profiles
  'feed', // Activity streams
  'comments', // Discussion areas

  // Commerce
  'product', // Product displays
  'catalog', // Product listings
  'checkout', // Purchase flow
])

export const CardClassificationSchema = z.object({
  type: z.array(CardContentTypeSchema).optional(),
  category: z.array(CardCategorySchema).optional(),
  useCase: z.array(CardUseCaseSchema).optional(),
})

export type CardClassification = z.infer<typeof CardClassificationSchema>
