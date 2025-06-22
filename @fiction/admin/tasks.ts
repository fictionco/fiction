import type { CompletionTask, CompletionTaskWithStatus, EndpointResponse } from '@fiction/core'
import type { FictionAdminSettings } from '.'
import { FictionPlugin, safeDirname, sortPriority } from '@fiction/core'

type TaskKeys = 'profile' | 'editSite' | 'publishContent' | 'shareSite'

export class CompletionTaskEngine extends FictionPlugin<FictionAdminSettings> {
  private tasks: CompletionTask<TaskKeys>[] = [
    { key: 'profile', title: 'Setup your profile details', href: '/app/settings' },
  ]

  constructor(settings: FictionAdminSettings) {
    super('CompletionTaskEngine', { root: safeDirname(import.meta.url), ...settings })
  }

  addTask(task: CompletionTask<TaskKeys>): void {
    this.tasks = this.tasks.filter(t => t.key !== task.key)
    this.tasks.push({ priority: 100, ...task })
  }

  async getTasks(): Promise<CompletionTaskWithStatus[]> {
    const fictionUser = this.settings.fictionUser
    await fictionUser.userInitialized({ caller: 'onboard' })
    const org = fictionUser?.activeOrganization.value
    const orgOnboard = org?.onboard?.items || {}

    const sorted = sortPriority(this.tasks, { centerNumber: 100 })

    const results: CompletionTaskWithStatus[] = []
    for (const task of sorted) {
      let status: 'ready' | 'pending' = 'pending'

      if (orgOnboard[task.key]?.status === 'ready') {
        status = 'ready'
      }

      results.push({ ...task, status })
    }

    return results
  }

  async markTaskStatus(args: {
    key: TaskKeys
    status?: 'ready' | 'pending'
    data?: Record<string, unknown>
  }): Promise<EndpointResponse> {
    const { key, data = {}, status = 'ready' } = args
    const fictionUser = this.settings.fictionUser
    await fictionUser.userInitialized({ caller: 'markComplete' })
    const org = fictionUser.activeOrganization.value
    if (!org?.orgId)
      throw new Error('No organization found for user')

    if (org.onboard?.items?.[key]?.status === 'ready') {
      return { status: 'success' }
    }

    this.log.info(`Marking task ${key} as ${status}`, { data: { orgId: org.orgId, data } })
    return await fictionUser.requests.ManageOrganization.projectRequest({
      _action: 'manageOnboard',
      settings: {
        items: {
          [key]: { key, status, completedAt: new Date().toISOString(), data },
        },
      },
    }, { caller: 'markComplete' })
  }
}
