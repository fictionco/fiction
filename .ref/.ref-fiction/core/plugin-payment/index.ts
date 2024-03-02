// @unocss-include
import type {
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  AppRoute,
  FactorPlugin,
  dayjs,
} from '@factor/api'

import type { FactorStripe, StripePriceConfig } from '@factor/plugin-stripe'
import type stripe from 'stripe'
import { getCycleRange } from '@factor/plugin-stripe/utils'
import { pricing } from '../stripe'

export type FictionPaymentSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorStripe: FactorStripe
} & FactorPluginSettings

export type CustomerDetails = {
  customerId?: string
  organizationId?: string
  plan: 'pro' | 'plus' | 'standard' | 'hobby' | 'free'
  planName: string
  tier: number
  quantity: number
  quantityImages: number
  quantityModels: number
  minutes: number
  link: string
  icon: string
  subscriptionId?: string
  customer?: stripe.Customer
  isTrial?: boolean
  isCanceled?: boolean
  upgradeTier?: CustomerDetails
  upgradeQuantity?: CustomerDetails
  anchorDateUtc?: number
  cyclePeriod?: string
  cycleEndAtIso?: string
  cycleStartAtIso?: string
  specialPlan?: 'vip' | 'npo' | ''
  specialQuantity?: number
  totalQuantity?: number
} & StripePriceConfig

export class FictionPayment extends FactorPlugin<FictionPaymentSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorStripe = this.settings.factorStripe
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)

  liveStripe = this.utils.vue.computed(
    () => this.factorStripe.stripeMode.value === 'live',
  )

  activeCustomer = this.utils.vue.ref<CustomerDetails | undefined>()
  initialized?: Promise<boolean>
  resolveCustomerLoad?: (value: boolean | PromiseLike<boolean>) => void
  constructor(settings: FictionPaymentSettings) {
    super('FictionPayment', settings)
    const uiPaths = [`${this.root}*.vue`, `${this.root}*.ts`]

    this.factorApp.addUiPaths(uiPaths)

    this.factorRouter?.update([
      new AppRoute({
        name: 'plans',
        parent: 'app',
        path: '/org/:organizationId/plans',
        component: () => import('./PageSelectPlan.vue'),
      }),
      new AppRoute({
        name: 'checkout',
        parent: 'app',
        path: '/org/:organizationId/checkout-plan',
        component: () => import('./PageCheckoutSuccess.vue'),
      }),
      new AppRoute({
        name: 'manageBilling',
        parent: 'app',
        icon: 'i-heroicons-credit-card',
        path: '/org/:organizationId/change-plan',
        component: () => import('./PageManageBilling.vue'),
      }),
    ])

    this.customerDataWatcher().catch(console.error)
  }

  async customerDataWatcher() {
    if (!this.factorEnv.isApp.value)
      return

    if (this.utils.isActualBrowser())
      this.customerInitialized().catch(console.error)

    await this.factorUser.pageInitialized()

    this.loading.value = true
    /**
     * Update when organization changes
     */
    this.utils.vue.watch(
      () => this.factorUser?.activeOrganization.value?.organizationId,
      async () => {
        await this.setCustomerData({ reason: 'organization changed' })
      },

      { immediate: true },
    )
  }

  customerInitialized = async (): Promise<CustomerDetails | undefined> => {
    if (!this.initialized) {
      this.initialized = new Promise(async (resolve) => {
        this.resolveCustomerLoad = resolve
      })
    }

    await this.initialized

    return this.activeCustomer.value
  }

  getSpecialPlan = (
    details: Partial<CustomerDetails>,
  ): Partial<CustomerDetails> => {
    const sp = details.specialPlan

    if (!sp)
      return details

    if (sp === 'vip') {
      return {
        ...details,
        specialQuantity: 12_000,
        planName: 'VIP',
      }
    }
    else {
      return details
    }
  }

  setCustomerData = async (
    args: { reason?: string } = {},
  ): Promise<CustomerDetails | undefined> => {
    const { reason } = args
    this.log.warn(`setCustomerData called: ${reason}`, {
      data: {
        user: this.factorUser.activeUser.value,
        org: this.factorUser.activeOrganization.value,
      },
    })

    if (!this.factorStripe)
      throw new Error('Stripe plugin not found')

    await this.factorUser.userInitialized()

    let details: Partial<CustomerDetails> | undefined

    const org = this.factorUser?.activeOrganization.value

    if (!org || !org.organizationId) {
      this.activeCustomer.value = undefined
      if (this.resolveCustomerLoad)
        this.resolveCustomerLoad(true)
      return
    }

    const {
      organizationName,
      organizationEmail,
      organizationId,
      specialPlan,
      createdAt,
    } = org

    this.loading.value = true

    const r = await this.factorStripe.requests.GetCustomerData.request({
      organizationId,
      organizationName,
      email: organizationEmail ?? this.factorUser?.activeUser.value?.email,
    })

    const customerData = r.data
    const customerId = customerData?.customer?.id

    const link = this.factorRouter?.link('manageBilling').value

    this.log.info(
      `SET CUSTOMER DATA: ${organizationId}, live: ${this.liveStripe.value}`,
      { data: { reason, customer: customerData } },
    )

    const specialPlanMap = { vip: 12_000, npo: 6000 }

    const basics = {
      specialPlan,
      specialQuantity:
        specialPlan && specialPlanMap[specialPlan]
          ? specialPlanMap[specialPlan]
          : 0,
      customerId,
      organizationId,
    }

    customerData?.subscriptions?.forEach((sub) => {
      const price = pricing.find(
        p => p.quantity === sub.items.data[0].quantity,
      )

      if (price && (sub.status === `trialing` || sub.status === `active`)) {
        const { timeEnd, timeStart, anchorDateUtc } = getCycleRange({
          timestamp: sub.billing_cycle_anchor,
        })
        const subscriptionId = sub.id
        const isTrial = sub.status === `trialing`
        const isCanceled = !!sub.canceled_at
        const base: Partial<CustomerDetails> = {
          ...basics,
          ...price,
          link: this.factorRouter?.link('organizationIndex').value,
          subscriptionId,
          isTrial,
          anchorDateUtc,
          cyclePeriod: 'month',
          cycleEndAtIso: timeEnd.toISOString(),
          cycleStartAtIso: timeStart.toISOString(),
          quantityImages: 2000,
          quantityModels: 100,
          isCanceled,
        }

        if (price?.group === 'plus') {
          details = {
            ...base,
            tier: 40,
            plan: 'plus',
            planName: 'Pro Plus',
            icon: 'i-carbon-group-access',
            link,
          }
        }
        else if (price?.group === 'pro') {
          details = {
            ...base,
            tier: 30,
            plan: 'pro',
            planName: 'Pro',
            icon: 'i-carbon-badge',
            link,
          }
        }
        else if (price?.group === 'standard') {
          details = {
            ...base,
            tier: 20,
            plan: 'standard',
            planName: 'Standard',
            icon: 'i-carbon-badge',
            link,
          }
        }
        else if (price?.group === 'hobby') {
          details = {
            ...base,
            plan: 'hobby',
            tier: 10,
            planName: 'Hobby',
            icon: 'i-carbon-star',
            link,
          }
        }
        if (details) {
          const ind = pricing.findIndex(p => p.quantity === details?.quantity)
          const upgradeQuantity
            = ind >= 0 ? (pricing[ind + 1] as CustomerDetails) : undefined
          const nextTier
            = details.plan === 'hobby'
              ? 'standard'
              : details.plan === 'pro'
                ? 'plus'
                : details.plan === 'standard'
                  ? 'pro'
                  : undefined

          const upgradeTier
            = nextTier
            && (pricing
              .filter(p => p.group === nextTier)
              .sort(
                (a, b) => (a.quantity || 0) - (b.quantity || 0),
              )[0] as CustomerDetails)

          if (upgradeQuantity)
            upgradeQuantity.subscriptionId = subscriptionId
          if (upgradeTier)
            upgradeTier.subscriptionId = subscriptionId

          details = { ...details, upgradeQuantity, upgradeTier }
        }
      }
    })

    if (!details) {
      const upgradeTier = pricing
        .filter(p => p.group === 'standard')
        .sort(
          (a, b) => (a.quantity || 0) - (b.quantity || 0),
        )[0] as CustomerDetails

      const dayJsCreatedAt = dayjs(createdAt)

      const now = dayjs()
      const cycleStartAt = dayJsCreatedAt.year(now.year()).month(now.month())

      // If the cycle start date is in the future, move it back one month
      if (cycleStartAt.isAfter(now))
        cycleStartAt.subtract(1, 'month')

      const cycleEndAt = cycleStartAt.add(1, 'month')

      details = {
        ...basics,
        plan: 'free',
        planName: 'Free',
        tier: 0,
        quantity: 0,
        quantityImages: 200,
        quantityModels: 3,
        icon: 'i-carbon-star-half',
        link: this.factorRouter?.link('plans').value,
        isTrial: false,
        priceId: '',
        cost: 0,
        group: 'free',
        costPerUnit: 0,
        duration: 'month',
        upgradeQuantity: upgradeTier,
        upgradeTier,
        cycleStartAtIso: cycleStartAt.toISOString(),
        cycleEndAtIso: cycleEndAt.toISOString(),
      }
    }

    if (details.specialPlan)
      details.planName = `${details.planName} (${details.specialPlan})`

    details.totalQuantity
      = (details.quantity || 0) + (details.specialQuantity || 0)

    details.minutes = details.totalQuantity * 0.06

    this.log.info(`SET CUSTOMER RESULT ${organizationId}`, { data: details })

    this.activeCustomer.value = details as CustomerDetails
    this.loading.value = false

    if (this.resolveCustomerLoad)
      this.resolveCustomerLoad(true)

    return details as CustomerDetails
  }

  hasPlan = this.utils.vue.computed(() => {
    return this.activeCustomer.value?.plan !== 'free'
  })

  hasPro = this.utils.vue.computed(() => {
    const p = this.activeCustomer.value
    return p && p.tier >= 20
  })

  hasPlus = this.utils.vue.computed(() => {
    const p = this.activeCustomer.value
    return p && p.tier >= 40
  })
}
