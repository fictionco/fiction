import { _stop, shortId } from '@factor/api'
import { getDb, getPrivateUser } from '@factor/server'
import type { FullUser } from '@factor/types'
import type { Knex } from 'knex'
import type { Experiment, Variant } from '@kaption/types'
import { AppTable } from '@kaption/types'
import { fetchAnalyticsServer } from '../_data'
import type { PrimaryEndpointMethodWithBearer } from '../serverTypes'

// export const createNewExperiment = () => {}
// export const createNewVariant = () => {}

async function refreshSite(args: {
  userId: string
  projectId: string
}): Promise<FullUser | undefined> {
  const { userId, projectId } = args
  const [{ data: user }] = await Promise.all([
    // get updated user for replacement
    getPrivateUser({ userId }),
    // make the CDN reload script
    fetchAnalyticsServer('bustSiteScript', { projectId }),
  ])

  return user
}

export const manageExperiment: PrimaryEndpointMethodWithBearer<
  'manageExperiment'
> = async (args) => {
  const {
    projectId,
    experimentName,
    experimentStatus,
    experimentDescription,
    variantWeights,
    rules,
    goals,
    bearer,
    _action,
  } = args

  let { experimentId } = args
  if (!_action)
    throw _stop({ message: '_action is required' })
  if (!projectId)
    throw _stop({ message: 'projectId is missing' })

  if (_action !== 'create' && !experimentId)
    throw _stop({ message: 'id is required' })
  else
    experimentId = experimentId || shortId()

  if (_action === 'create' && !experimentName)
    throw _stop({ message: 'name is required' })

  const db = await getDb()
  let experiment: Experiment | undefined
  let message: string | undefined
  let setter: Knex.Raw | undefined

  if (_action === 'create' || _action === 'update') {
    const saveExperiment: Partial<Experiment> = {
      experimentId,
      experimentName,
      experimentStatus,
      experimentDescription,
      rules,
      goals,
      variantWeights,
    }
    setter = db.raw(
      `jsonb_merge_patch(experiments::jsonb, ?::jsonb)`,
      JSON.stringify({
        [experimentId]: saveExperiment,
      }),
    )

    message = _action === 'create' ? 'experiment created' : 'experiment updated'
  }
  else if (_action === 'delete') {
    setter = db.raw(
      `coalesce(experiments::jsonb, '{}'::jsonb) - ?`,
      experimentId,
    )
    message = 'experiment deleted'
  }

  if (setter) {
    const r = await db
      .table(AppTable.Projects)
      .update({
        experiments: setter,
      })
      .where({ projectId })
      .returning('experiments')

    const experiments: Record<string, Experiment> = r[0]

    experiment = experiments[experimentId]
  }

  const user = await refreshSite({ userId: bearer.userId, projectId })

  return {
    status: 'success',
    data: experiment,
    user,
    message,
  }
}

export const manageVariant: PrimaryEndpointMethodWithBearer<
  'manageVariant'
> = async (args) => {
  const {
    projectId,
    variantName,
    variantDescription,
    experimentId,
    changes,
    weight,
    _action,
    bearer,
  } = args

  let { variantId } = args

  if (!_action)
    throw _stop({ message: '_action is required' })
  if (!projectId)
    throw _stop({ message: 'projectId is missing' })

  if (_action !== 'create' && !variantId)
    throw _stop({ message: 'id is required' })
  else
    variantId = variantId || shortId()

  const db = await getDb()
  let variant: Variant | undefined
  let message: string | undefined

  let saveVariant: Partial<Variant> | null | undefined
  if (_action === 'create' || _action === 'update') {
    saveVariant = {
      experimentId,
      variantId,
      variantName,
      variantDescription,
      changes,
      weight,
    }

    message = _action === 'create' ? 'variant created' : 'variant updated'
  }
  else if (_action === 'delete') {
    saveVariant = null
    message = 'variant deleted'
  }

  if (typeof saveVariant !== 'undefined') {
    const r = await db
      .table(AppTable.Projects)
      .update({
        experiments: db.raw(
          `jsonb_merge_patch(experiments::jsonb, ?::jsonb)`,
          JSON.stringify({
            [experimentId]: { variants: { [variantId]: saveVariant } },
          }),
        ),
      })
      .where({ projectId })
      .returning('experiments')

    const experiments: Record<string, Experiment> = r[0]

    variant = experiments[experimentId].variants?.[variantId]
  }

  const user = await refreshSite({ userId: bearer.userId, projectId })

  return {
    status: 'success',
    data: variant,
    user,
    message,
  }
}
