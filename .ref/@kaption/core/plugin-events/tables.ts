import { FactorDbTable, objectId, validateEmail } from '@factor/api'
import { KaptionDbCol } from '../utils/db'
import type {
  ConversionType,
  MetricType,
  TargetingFilter,
  TriggerType,
} from './types'

// export interface CustomTrackEvent {
//   eventId?: string
//   event: string
//   conversion?: ConversionType
//   category?: string
//   action?: string
//   label?: string
//   eventTrigger?: TriggerType
//   threshold?: number
//   metric?: MetricType
//   weight?: number
//   points?: number
//   path?: string
//   selector?: string
//   value?: number
//   createdAt?: number
//   updatedAt?: number
//   rules: TargetingFilter[]
//   notifyEmail: string
// }

export const customEventColumns = [
  new KaptionDbCol({
    key: 'eventId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('ev')`))
    },
    default: () => objectId(),
  }),
  new KaptionDbCol({
    key: 'projectId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`kaption_project.project_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new KaptionDbCol({
    key: 'event',
    create: ({ schema, column }) => schema.string(column.pgKey).index(),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'conversion',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as ConversionType,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'category',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'action',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'label',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'eventTrigger',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as TriggerType,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'threshold',
    create: ({ schema, column }) => schema.float(column.pgKey),
    default: () => 0,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'metric',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as MetricType,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'weight',
    create: ({ schema, column }) => schema.float(column.pgKey),
    default: () => 0,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'points',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'value',
    create: ({ schema, column }) => schema.float(column.pgKey),
    default: () => 0,
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'pathMatch',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'selector',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'rules',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => [] as TargetingFilter[],
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
  }),
  new KaptionDbCol({
    key: 'isNotification',
    create: ({ schema, column }) => schema.boolean(column.pgKey),
    default: () => false,
    isSetting: true,
    isPrivate: true,
  }),
  new KaptionDbCol({
    key: 'notificationTitle',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '',
    isSetting: true,
    isPrivate: true,
  }),
  new KaptionDbCol({
    key: 'notificationBody',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '',
    isSetting: true,
    isPrivate: true,
  }),
  new KaptionDbCol({
    key: 'notificationEmail',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
    isPrivate: true,
    prepare: ({ value }) => {
      if (!value)
        return
      return (value as string)
        .split(',')
        .map(v => validateEmail(v.trim()))
        .filter(Boolean)
        .join(', ')
    },
  }),
] as const

export const customEventTable = new FactorDbTable({
  tableKey: 'kaption_custom_event',
  timestamps: true,
  columns: customEventColumns,
})

export const getAdminTables = () => [customEventTable]
