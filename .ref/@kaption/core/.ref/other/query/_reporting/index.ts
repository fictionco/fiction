import { reportUsage } from '@kaption/utils'

/**
 * Initialize usage reporting for billing
 */
export async function initializeReporting(): Promise<void> {
  // check every 10 minutes in production
  // once this is stable it can be made longer
  const min = process.env.NODE_ENV === 'development' ? 1 : 10

  setInterval(async () => {
    await reportUsage()
  }, 60_000 * min)
}
