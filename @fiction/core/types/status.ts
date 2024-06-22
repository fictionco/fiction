import { z } from 'zod'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'hidden', 'protected', 'deleted', 'archived', 'trashed', 'spam'])

export type PostStatus = z.infer<typeof PostStatusSchema>

export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled'])

export type ProgressStatus = z.infer<typeof ProgressStatusSchema>

export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'cancelled', 'bounced', 'complained'])

export type SyndicateStatus = z.infer<typeof SyndicateStatusSchema>

export interface StatusDetails {
  status?: string
  message: string
  trace?: string
}
