import type { z } from 'zod'
import type { SyndicateStatusSchema } from '../schemas/schemas.js'

export type SyndicateStatus = z.infer<typeof SyndicateStatusSchema>

export interface StatusDetails {
  status?: string
  message: string
  trace?: string
}
