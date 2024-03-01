import type { Experiment, Project } from '@kaption/types'
import { AppTable } from '@kaption/types'
import { getDb } from '@kaption/db/db-postgresb-postgres'

export async function findOneExperiment(args: {
  projectId?: string
  experimentId: string
}): Promise<Experiment | undefined> {
  const { projectId, experimentId } = args
  const db = await getDb()

  const result: Partial<Project> = await db
    .select('experiments')
    .from(AppTable.Projects)
    .where({ projectId })
    .first()

  const { experiments } = result

  return experiments?.[experimentId] || undefined
}
