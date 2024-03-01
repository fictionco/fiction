// @unocss-include
import type { FactorDb, FactorPluginSettings, FactorServer, FactorUser } from '@factor/api'
import { FactorPlugin, vue } from '@factor/api'

import { QueryManageOnboard } from './query'
import type { OnboardItem } from './schema'
import { onboardColumns } from './schema'

type FictionOnboardSettings = {
  factorServer: FactorServer
  fictionInstance?: FictionInstance
  fictionJobs?: FictionJobs
  factorDb: FactorDb
  factorUser: FactorUser
} & FactorPluginSettings
export class FictionOnboard extends FactorPlugin<FictionOnboardSettings> {
  factorAdmin = this.settings.factorAdmin
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp

  root = this.utils.safeDirname(import.meta.url)

  queries = this.createQueries()

  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  onboardItems: OnboardItem[] = [
    {
      value: 'option-1',
      icon: 'i-carbon-folder-add',
      name: 'Setup Project Details',
      desc: 'Start capturing data and events by adding the tracking code to your site and apps.',
      tasks: vue.computed(() => {
        const project = this.factorAdmin?.activeProject.value
        const projectName = project?.projectName
        const origins = project?.origins || []
        return [
          {
            text: 'Add Project Name',
            value: projectName,
            completed: !!projectName,
          },
          {
            text: 'Add Website URL(s)',
            value: origins.join(', '),
            completed: origins.length > 0,
          },
        ]
      }),
      link: this.factorRouter?.link('projectSettings').value,
      priority: 30,
    },
    {
      value: 'option-1',
      icon: 'i-carbon-cloud-upload',
      name: 'Install and Start Tracking',
      desc: 'Start capturing events by adding the tracking code to your site and apps.',
      tasks: vue.computed(() => {
        const project = this.factorAdmin?.activeProject.value
        const status = project?.trackingStatus
        return [
          {
            text: `Send tracking data`,
            value: `Current status: ${status}`,
            completed: status === 'active',
          },
        ]
      }),
      link: this.factorRouter?.link('trackingCode').value,
      priority: 50,
    },
    // {
    //   value: "option-1",
    //   icon: "i-carbon-chart-line",
    //   name: "Custom Event Tracking",
    //   desc: "Create a custom event for tracking",
    //   completed: vue.computed(() => {
    //     const project = this.factorAdmin?.activeProject.value
    //     return project?.trackingStatus === "active"
    //   }),
    //   link: this.factorRouter?.link("eventNew").value,
    // },
    // {
    //   value: "option-1",
    //   icon: "i-carbon-copy-file",
    //   name: "Forms and Feedback",
    //   desc: "Create a form and start collecting qualitative details from your users.",
    //   completed: false,
    //   link: this.factorRouter?.link("formIndex").value,
    // },
    {
      value: 'option-1',
      icon: 'i-carbon-user-follow',
      name: 'Invite Team Members',
      desc: 'Kaption is fun with friends.',
      tasks: vue.computed(() => {
        const org = this.factorAdmin?.activeOrganization.value
        const count = org?.memberCount || 0

        return [
          {
            text: `Invite one or more to this organization`,
            value: `current members: ${count}`,
            completed: count > 1,
          },
        ]
      }),
      link: this.factorRouter?.link('teamInvite').value,
      priority: 500,
    },
  ]

  constructor(settings: FictionOnboardSettings) {
    super('onboard', settings)

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`])

    // add analytics columns to kaption project table
    this.factorDb.addColumns('kaption_project', onboardColumns)
  }

  setup() {}

  protected createQueries() {
    const deps = {
      ...this.settings,
    }
    return {
      ManageOnboard: new QueryManageOnboard(deps),
    } as const
  }

  getOnboardItems() {
    const rawItems = this.utils.sortPriority(this.onboardItems)

    return rawItems.map((item) => {
      return {
        ...item,
        completed: vue.computed(() => {
          return item.tasks?.value?.every(task => task.completed) ?? false
        }),
      }
    })
  }
}
