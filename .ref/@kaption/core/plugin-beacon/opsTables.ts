import { FactorDbTable, objectId } from '@factor/api'
import { KaptionDbCol } from '../utils/db'

export const usageColumns = [
  new KaptionDbCol({
    key: 'usageId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('use')`))
    },
    default: () => objectId(),
  }),
  new KaptionDbCol({
    key: 'period',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as 'day' | 'month' | 'hour',
  }),
  new KaptionDbCol({
    key: 'projectId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`kaption_project.project_id`)
        .onUpdate('CASCADE')
    },
    default: () => objectId(),
  }),
  new KaptionDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`kaption_organization.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => objectId(),
  }),
] as const

export const usageTable = new FactorDbTable({
  tableKey: 'kaption_usage',
  timestamps: true,
  columns: usageColumns,
})

export const getEventOpsTables = () => [usageTable]
