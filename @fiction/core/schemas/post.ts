import { z } from 'zod/v4'
import { colorThemeUser } from '../utils/colors.js'
import { ActionAreaSchema } from './actions.js'
import { MediaSchema } from './media.js'
import { PostStatusSchema } from './standard.js'
import { SuperTitleSchema } from './typography.js'

type SchemaOptions = {
  generate?: boolean
}

function createPostSEOSchema({ generate = false }: SchemaOptions = {}) {
  return z.object({
    title: z.string().optional().meta({ generate, description: 'Custom SEO title, defaults to post title if not specified' }),
    description: z.string().optional().meta({ generate, description: 'Meta description for search engines and social sharing' }),
  }).meta({ description: 'SEO metadata for the post' })
}

function createAuthorSchema({ generate = false }: SchemaOptions = {}) {
  return z.object({
    fullName: z.string().optional().meta({ generate }),
    email: z.string().optional().meta({ description: 'Author email address' }),
    avatar: MediaSchema.optional().meta({ generate }),
    title: z.string().optional().meta({ generate }),
    headline: z.string().optional().meta({ generate }),
    about: z.string().optional().meta({ generate }),
    websiteUrl: z.string().optional().meta({ description: 'Author website URL' }),
  })
}

function createPostUserConfigSchema({ generate = false }: SchemaOptions = {}) {
  return z.object({
    seo: createPostSEOSchema({ generate }).optional().meta({
      description: 'Search engine and social media optimization settings',
    }),
    isContentCompletionDisabled: z.boolean().optional(),
  })
}

function createPostSchema({ generate = false }: SchemaOptions = {}) {
  return z.object({
    // Core Content
    title: z.string().optional().meta({ generate, description: 'Primary headline' }),
    subTitle: z.string().optional().meta({ generate, description: 'Supporting headline' }),
    superTitle: SuperTitleSchema.optional().meta({ generate, description: 'Small header text above title' }),
    content: z.string().optional().meta({ generate, description: 'Main content in HTML/Markdown' }),
    excerpt: z.string().optional().meta({ generate, description: 'Brief summary for previews' }),

    // Meta Information
    status: PostStatusSchema.optional().meta({ description: 'Publication state' }),
    dateAt: z.string().optional().meta({ description: 'Publish date' }),
    publishAt: z.string().optional().meta({ description: 'Scheduled publish date' }),

    // Visual Elements
    media: MediaSchema.optional().meta({ generate, description: 'Featured image/video' }),
    icon: MediaSchema.optional().meta({ generate, description: 'List view icon' }),
    theme: z.enum(colorThemeUser).optional().meta({ generate, description: 'Color theme' }),

    // Taxonomy & Organization
    slug: z.string().optional().meta({ description: 'URL-friendly title' }),
    href: z.string().optional().meta({ description: 'Content permalink' }),
    tags: z.array(z.string()).optional().meta({ generate, description: 'Topic labels' }),
    categories: z.array(z.string()).optional().meta({ generate, description: 'Content groupings' }),

    // Associated Data
    authors: z.array(createAuthorSchema({ generate })).optional().meta({ description: 'Content creators' }),
    action: ActionAreaSchema.optional().meta({ generate, description: 'Interactive buttons' }),

    userConfig: createPostUserConfigSchema({ generate }).optional().meta({ description: 'Custom settings' }),
    testId: z.string().optional().meta({ description: 'Test ID for automated testing' }),
  })
}

// Standard exports
export const PostSEOSchema = createPostSEOSchema()
export const AuthorSchema = createAuthorSchema()
export const PostSchema = createPostSchema()
export type PostObject = z.infer<typeof PostSchema>

// AI-enabled exports
export const PostSEOSchemaWithAi = createPostSEOSchema({ generate: true })
export const AuthorSchemaWithAi = createAuthorSchema({ generate: true })
export const PostSchemaWithAi = createPostSchema({ generate: true })

// Factory functions
export { createAuthorSchema, createPostSchema, createPostSEOSchema }

// Types
export type PostSEO = z.infer<typeof PostSEOSchema>
export type Author = z.infer<typeof AuthorSchema>
export type Post = z.infer<typeof PostSchema>
