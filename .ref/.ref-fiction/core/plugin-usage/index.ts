// @unocss-include

import type {
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
  vue,
} from '@factor/api'
import type { FictionPayment } from '../plugin-payment'
import { QueryManageUsage } from './endpoint'
import { tables } from './tables'

export type FictionUsageSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  fictionPayment: FictionPayment
} & FactorPluginSettings

interface ActiveUsage {
  usedModels: number
  paidModels: number
  remainingModels: number
  usedImages: number
  paidImages: number
  remainingImages: number
  usedMinutes: number
  paidMinutes: number
  cycleEndAtIso: string
  cycleStartAtIso: string
  percentUsed: number
}

export class FictionUsage extends FactorPlugin<FictionUsageSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  fictionPayment = this.settings.fictionPayment
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
    return this.fictionPayment?.activeCustomer.value?.cycleEndAtIso
  })

  cycleStartAtIso = vue.computed(() => {
    return this.fictionPayment?.activeCustomer.value?.cycleStartAtIso
  })

  constructor(settings: FictionUsageSettings) {
    super('FictionUsage', settings)
    const uiPaths = [`${this.root}*.vue`, `${this.root}*.ts`]

    this.factorApp.addUiPaths(uiPaths)
    this.factorDb.addTables(tables)

    if (this.factorEnv.isApp.value) {
      this.clientStateLoop()
      this.watchCustomerId().catch(console.error)
    }
  }

  /**
   * @client
   * polls the server for instance state, makes sure it doesn't get out of sync
   */
  clientStateLoop() {
    setTimeout(async () => {
      await this.fictionPayment.customerInitialized()

      await this.setUsage()
      this.clientStateLoop()
    }, 60_000 * 3)
  }

  async setUsage() {
    const customer = this.fictionPayment.activeCustomer.value

    this.log.info('set usage', { data: { customer } })

    if (!customer?.cycleEndAtIso || !customer?.cycleStartAtIso)
      return

    const { cycleEndAtIso, cycleStartAtIso, quantityImages, quantityModels }
      = customer

    const result = await this.requests.ManageUsage.projectRequest(
      {
        _action: 'getUsage',
        cycleEndAtIso,
        cycleStartAtIso,
      },
      { debug: true },
    )

    const usedMinutes = result.data?.minutes || 0
    const usedModels = result.data?.models || 0
    const usedImages = result.data?.images || 0

    const paidMinutes = this.fictionPayment?.activeCustomer.value?.minutes || 0
    const percentUsed = Math.round((usedMinutes / paidMinutes) * 100)

    this.activeUsage.value = {
      usedMinutes,
      usedModels,
      paidModels: quantityModels,
      remainingModels: quantityModels - usedModels,
      usedImages,
      paidImages: quantityImages,
      remainingImages: quantityImages - usedImages,
      paidMinutes,
      percentUsed,
      cycleEndAtIso,
      cycleStartAtIso,
    }

    this.log.info(`set ${usedMinutes} usage this cycle`, {
      data: this.activeUsage.value,
    })
  }

  /**
   * @client
   */
  async watchCustomerId() {
    await this.fictionPayment.customerInitialized()

    vue.watch(
      () => this.fictionPayment?.activeCustomer.value,
      async () => {
        await this.setUsage()
      },

      { immediate: true },
    )
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      fictionModel: this,
    }
    return {
      ManageUsage: new QueryManageUsage(deps),
    } as const
  }
}
