// @unocss-include

import type {
  FictionApp,
  FictionDb,
  FictionPluginSettings,
  FictionServer,
  FictionUser,
} from '@fiction/core'
import {
  FictionPlugin,
  vue,
} from '@fiction/core'
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
  fictionEnv = this.settings.fictionEnv
  fictionApp = this.settings.fictionApp
  fictionDb = this.settings.fictionDb
  fictionUser = this.settings.fictionUser
  fictionServer = this.settings.fictionServer
  fictionStripe = this.settings.fictionStripe
  loading = vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.fictionEnv.isProd

  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.fictionServer,
    fictionUser: this.fictionUser,
  })

  activeUsage = vue.ref<ActiveUsage | undefined>()

  cycleEndAtIso = vue.computed(() => {
    return this.fictionStripe?.activeCustomer.value?.cycleEndAtIso
  })

  cycleStartAtIso = vue.computed(() => {
    return this.fictionStripe?.activeCustomer.value?.cycleStartAtIso
  })

  constructor(settings: FictionUsageSettings) {
    super('FictionUsage', settings)

    this.fictionDb.addTables(tables)
  }

  async setUsage() {
    const customer = this.fictionStripe.activeCustomer.value

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

    const paidCredits = this.fictionStripe?.activeCustomer.value?.credits || 0
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

  protected createQueries() {
    const deps = {
      fictionDb: this.fictionDb,
      fictionUser: this.fictionUser,
      fictionUsage: this,
    }
    return {
      ManageUsage: new QueryManageUsage(deps),
    } as const
  }
}
