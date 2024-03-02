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
  FactorPlugin,
  vue,
} from '@factor/api'
import type { FactorDashboard } from '../plugin-dashboards'
import type { FictionInstance } from '../plugin-instance'
import type { FictionJobs } from '../plugin-jobs'
import type { FictionModel } from '../plugin-models'
import type { FictionPayment } from '../plugin-payment'
import type { OrgCounts } from './query'
import { QueryGetCounts } from './query'
import type { OnboardItem } from './schema'

type FictionOnboardSettings = {
  factorDashboard?: FactorDashboard
  factorServer: FactorServer
  fictionModel: FictionModel
  fictionInstance?: FictionInstance
  fictionJobs?: FictionJobs
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  fictionPayment: FictionPayment
} & FactorPluginSettings

export class FictionOnboard extends FactorPlugin<FictionOnboardSettings> {
  factorDashboard = this.settings.factorDashboard
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp
  factorServer = this.settings.factorServer
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  fictionModel = this.settings.fictionModel
  fictionInstance = this.settings.fictionInstance
  fictionPayment = this.settings.fictionPayment
  root = this.utils.safeDirname(import.meta.url)
  counts = vue.ref<OrgCounts>()
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  stats = vue.computed(() => {
    const total = this.onboardItems.value.length
    const completed = this.onboardItems.value.filter(
      item => item.status === 'ready',
    )
    return {
      percentComplete: Math.round((completed.length / total) * 100),
      total,
      completed: completed.length,
    }
  })

  trainFirstModelVisible = vue.computed(() => {
    const user = this.factorUser.activeUser.value
    const org = this.factorUser.activeOrganization.value

    if (!user || !org)
      return false

    const w = org.onboard?.tasks?.trainFirstModel !== 'ready'

    return !!w
  })

  onboardItems = vue.computed<OnboardItem[]>(() => {
    const organization = this.factorUser?.activeOrganization.value
    const organizationId = organization?.organizationId
    const organizationName = organization?.organizationName
    const memberCount = organization?.memberCount || 0
    const skipped = organization?.onboard?.skip || {}
    const {
      countStarts = 0,
      countCollections = 0,
      countModels = 0,
      countRenders = 0,
    } = this.counts.value || {}
    const items = [
      {
        stepId: 'account',
        name: 'Setup Account',
        desc: 'Set up your account and organization.',
        completed: !!organizationName,
        onClick: () => this.factorRouter?.goto('orgSettings'),
        priority: 30,
      },
      {
        stepId: 'start',
        name: 'Start Server',
        desc: 'Start your server for the first time.',
        completed: countStarts > 0,
        onClick: () => this.utils.emitEvent('showServerManager'),
        priority: 100,
      },
      {
        stepId: 'model',
        name: 'Train Your First Model',
        desc: 'Upload some pictures and train a model. Avatars are a great first step.',
        completed: countModels > 0,
        onClick: () => this.factorRouter?.goto('modelIndex', {}, { create: 1 }),
        priority: 110,
      },
      {
        stepId: 'render',
        name: 'Render Images from Model',
        desc: 'Render some images using your model.',
        completed: countRenders > 0,
        onClick: () => this.factorRouter?.goto('renderCreate'),
        priority: 500,
      },
      {
        stepId: 'collection',
        name: 'Create A Collection',
        desc: 'Create a collection to organize your images.',
        completed: countCollections > 0 || skipped.collection,
        onClick: () =>
          this.factorRouter?.goto('collectionEdit', { collectionId: '' }),
        priority: 500,
        allowSkip: true,
      },
      {
        stepId: 'team',
        icon: 'i-carbon-user-follow',
        name: 'Invite People',
        desc: 'Add people to your organization and create things together.',
        completed: memberCount > 1 || skipped.team,
        onClick: () => this.factorRouter?.goto('teamInvite'),
        priority: 500,
        allowSkip: true,
      },
    ]

    const sorted = this.utils.sortPriority<OnboardItem[]>(items)

    sorted.sort((a, b) => {
      if (a.completed && !b.completed)
        return -1 // a comes first
      else if (!a.completed && b.completed)
        return 1 // b comes first
      else
        return 0 // no change in order
    })

    let incompleteFound = false
    for (const task of sorted) {
      if (task.completed) {
        task.status = 'ready'
      }
      else if (incompleteFound) {
        task.status = 'requested'
      }
      else {
        task.status = 'processing'
        incompleteFound = true
      }

      task.organizationId = organizationId
    }

    const lastThreeReady = new Set(
      sorted
        .filter(i => i.status === 'ready')
        .map(_ => _.stepId)
        .slice(-1),
    )

    const final = sorted.map((item) => {
      if (item.status === 'ready' && !lastThreeReady.has(item.stepId))
        return { ...item, hideReadyItem: true }
      else
        return item
    })

    return final
  })

  constructor(settings: FictionOnboardSettings) {
    super('onboard', settings)

    this.factorEnv?.addUiPaths([`${this.root}/**/*.vue`])

    // if (this.factorDashboard) {
    //   this.factorDashboard.addWidgets(getWidgets())

    //   this.factorDashboard.addToDashboard({
    //     layout: [{ widgetKey: "onboard" }],
    //     dashboardId: "home",
    //   })
    // }
  }

  async completeOnboarding() {
    await this.factorUser.requests.ManageOnboard.projectRequest({
      _action: 'update',
      settings: { completed: true },
      mode: 'organization',
    })
  }

  async skipItem(stepId: string) {
    await this.factorUser.requests.ManageOnboard.projectRequest({
      _action: 'update',
      settings: { skip: { [stepId]: true } },
      mode: 'organization',
    })
  }

  protected createQueries() {
    const deps = {
      ...this.settings,
    }
    return {
      GetCounts: new QueryGetCounts(deps),
    } as const
  }

  async updateCounts() {
    const r = await this.requests.GetCounts.projectRequest({})

    this.counts.value = r.data
  }
}
