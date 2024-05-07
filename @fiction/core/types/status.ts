export type PostStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'hidden'
  | 'protected'
  | 'deleted'
  | 'archived'
  | 'trashed'
  | 'spam'

export type ProgressStatus =
  | 'pending'
  | 'requested'
  | 'processing'
  | 'ready'
  | 'error'
  | 'cancelled'

export interface StatusDetails {
  status?: string
  message: string
  trace?: string
}
