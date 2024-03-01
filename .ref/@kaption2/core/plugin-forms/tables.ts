import { FactorDbCol, FactorDbTable } from '@factor/api/plugin-db'
import { AppTable } from '@factor/api/plugin-admin'
import { KaptionDbCol } from '../utils/db'

export const formTable = new FactorDbTable({
  tableKey: 'kaption_form',
  timestamps: true,
  columns: [
    new FactorDbCol({
      key: 'formId',
      create: ({ schema, column, db }) => {
        schema
          .string(column.pgKey)
          .primary()
          .defaultTo(db.raw(`generate_object_id()`))
      },
      default: () => '',
    }),

    new FactorDbCol({
      key: 'projectId',
      create: ({ schema, column }) => {
        schema
          .string(column.pgKey, 32)
          .references(`${AppTable.Projects}.project_id`)
          .onUpdate('CASCADE')
      },
      default: () => '',
    }),
    new FactorDbCol({
      key: 'templateId',
      create: ({ schema, column }) => schema.string(column.pgKey),
      default: () => '',
    }),
    new FactorDbCol({
      key: 'createdByUserId',
      create: ({ schema, column }) => {
        schema.string(column.pgKey, 32).references(`factor_user.user_id`)
      },
      default: () => '',
    }),
    new FactorDbCol({
      key: 'userConfig',
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
      isSetting: true,
      default: () => ({}),
    }),
    new FactorDbCol({
      key: 'formName',
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
      default: () => '',
    }),
    new FactorDbCol({
      key: 'description',
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
      default: () => '',
    }),

    new FactorDbCol({
      key: 'cards',
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
      isSetting: true,
      prepare: () => {},
      default: () => ({}),
    }),

    new FactorDbCol({
      key: 'views',
      create: ({ schema, column }) => schema.integer(column.pgKey),
      default: () => 0,
    }),

    new FactorDbCol({
      key: 'submissions',
      create: ({ schema, column }) => schema.integer(column.pgKey),
      default: () => 0,
    }),
  ],
})

export const integrationColumns = [
  new KaptionDbCol({
    key: 'formId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`kaption_form.form_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
    isSetting: true,
  }),
] as const
