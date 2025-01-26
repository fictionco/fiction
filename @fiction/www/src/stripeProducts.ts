import type { StripeProductConfig } from '@fiction/plugin-stripe/utils'

export function getStripeProductConfig(): StripeProductConfig[] {
  return [
    { key: 'free', tier: 1 },
    { key: 'standard', tier: 10 },
    { key: 'pro', tier: 20 },
    { key: 'workshop', tier: 30 },
  ]
}
