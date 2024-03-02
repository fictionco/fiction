// @unocss-include

import type {
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorServer,
  FactorUser,
} from '@fiction/core'
import {
  FactorPlugin,
  vue,
} from '@fiction/core'
import type { FactorStripe } from './plugin'
import { QueryManageUsage } from './endpointsUsage'
import { tables } from './tables'

export type FactorUsageSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorStripe: FactorStripe
} & FactorPluginSettings

interface ActiveUsage {
  usedCredits: number
  paidCredits: number
  remainingCredits: number
  cycleEndAtIso: string
  cycleStartAtIso: string
  percentUsed: number
}

export class FactorUsage extends FactorPlugin<FactorUsageSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorStripe = this.settings.factorStripe
  loading = vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd

  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  activeUsage = vue.ref<ActiveUsage | undefined>()

  cycleEndAtIso = vue.computed(() => {
    return this.factorStripe?.activeCustomer.value?.cycleEndAtIso
  })

  cycleStartAtIso = vue.computed(() => {
    return this.factorStripe?.activeCustomer.value?.cycleStartAtIso
  })

  constructor(settings: FactorUsageSettings) {
    super('FactorUsage', settings)

    this.factorDb.addTables(tables)
  }

  async setUsage() {
    const customer = this.factorStripe.activeCustomer.value

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

    const paidCredits = this.factorStripe?.activeCustomer.value?.credits || 0
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
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorUsage: this,
    }
    return {
      ManageUsage: new QueryManageUsage(deps),
    } as const
  }
}
