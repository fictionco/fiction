import type { FictionApp, FictionDb, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionStripe } from './plugin'
import { QueryManageUsage } from './endpointsUsage'
import { tables } from './tables'

export type FictionUsageSettings = {
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionUser: FictionUser
  fictionApp: FictionApp
  fictionStripe: FictionStripe
} & FictionPluginSettings

interface ActiveUsage {
  usedCredits: number
  paidCredits: number
  remainingCredits: number
  cycleEndAtIso: string
  cycleStartAtIso: string
  percentUsed: number
}

export class FictionUsage extends FictionPlugin<FictionUsageSettings> {
  loading = vue.ref(false)
  isLive = this.settings.fictionEnv.isProd

  queries = {
    ManageUsage: new QueryManageUsage({ ...this.settings }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser })

  activeUsage = vue.ref<ActiveUsage | undefined>()

  constructor(settings: FictionUsageSettings) {
    super('FictionUsage', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables(tables)
  }

  async setUsage() {
    const customer = this.settings.fictionStripe.activeCustomer.value

    this.log.info('set usage', { data: { customer } })

    if (!customer?.cycleEndAtIso || !customer?.cycleStartAtIso)
      return

    const { cycleEndAtIso, cycleStartAtIso } = customer

    const result = await this.requests.ManageUsage.projectRequest(
      {
        _action: 'getUsage',
        cycleEndAtIso,
        cycleStartAtIso,
      },
      { debug: true },
    )

    const usedCredits = result.data?.credits || 0

    const paidCredits = this.settings.fictionStripe?.activeCustomer.value?.credits || 0
    const percentUsed = Math.round((usedCredits / paidCredits) * 100)

    this.activeUsage.value = {
      usedCredits,
      paidCredits,
      percentUsed,
      remainingCredits: paidCredits - usedCredits,
      cycleEndAtIso,
      cycleStartAtIso,
    }

    this.log.info(`set ${usedCredits} usage this cycle`, {
      data: this.activeUsage.value,
    })
  }
}
