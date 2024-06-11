import type { Knex } from 'knex'
import type { ZodSchema } from 'zod'
import { ZodError, z } from 'zod'
import { toSnakeCase } from '../utils/index.js'
import type { LogHelper } from '../plugin-log/index.js'
import { log } from '../plugin-log/index.js'

type CreateCol = (params: { schema: Knex.AlterTableBuilder, column: FictionDbCol, db: Knex }) => void
type PrepareForStorage<T extends ColDefaultValue = ColDefaultValue> = (args: { value: T, key: string, db: Knex }) => unknown
export type ColDefaultValue = Knex.Value | undefined

export interface FictionDbColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> {
  key: U
  default: () => T
  zodSchema?: (args: { z: typeof z }) => ZodSchema<any>
  description?: string
  isComposite?: boolean // for composite keys
  create: CreateCol
  prepare?: PrepareForStorage<T>
  isPrivate?: boolean
  isSetting?: boolean
  isAuthority?: boolean
  isAdmin?: boolean
}
export class FictionDbCol<U extends string = string, T extends ColDefaultValue = ColDefaultValue> {
  key: U
  default: () => Knex.Value
  zodSchema?: ZodSchema<any>
  readonly pgKey: string
  readonly description?: string
  isComposite?: boolean
  create: CreateCol
  isPrivate: boolean
  isSetting: boolean
  isAuthority: boolean
  isAdmin: boolean
  prepare?: PrepareForStorage
  constructor(settings: FictionDbColSettings<U, T>) {
    const { description } = settings || {}
    this.description = description
    this.key = settings.key
    this.pgKey = toSnakeCase(settings.key)
    this.create = settings.create
    this.prepare = settings.prepare as PrepareForStorage // dont use generic as it overspecifies the class interface
    this.isComposite = settings.isComposite
    this.isPrivate = settings.isPrivate ?? false
    this.isSetting = settings.isSetting ?? false
    this.isAuthority = settings.isAuthority ?? false
    this.isAdmin = settings.isAdmin ?? false

    // Make sure undefined gets converted to null per knex standards
    this.default = () => (settings.default() || null)

    this.zodSchema = settings.zodSchema?.({ z })
  }

  createColumn(schema: Knex.AlterTableBuilder, db: Knex): void {
    log.info('FictionDbTable', `creating column: ${this.pgKey}`)
    return this.create({ schema, column: this, db })
  }
}
export interface FictionDbTableSettings {
  tableKey: string
  timestamps?: boolean
  columns: readonly FictionDbCol[]
  dependsOn?: string[]
  onCreate?: (t: Knex.CreateTableBuilder) => void
  uniqueOn?: string[]
}

export class FictionDbTable {
  readonly tableKey: string
  readonly pgTableKey: string
  columns: FictionDbCol[]
  log: LogHelper
  timestamps: boolean
  dependsOn: string[]
  onCreate?: (t: Knex.CreateTableBuilder) => void
  uniqueOn?: string[]
  constructor(params: FictionDbTableSettings) {
    this.tableKey = params.tableKey
    this.pgTableKey = toSnakeCase(params.tableKey)
    this.log = log.contextLogger(`FictionDbTable:${this.tableKey}`)
    this.timestamps = params.timestamps ?? false
    this.onCreate = params.onCreate
    this.columns = this.addDefaultColumns(params.columns)
    this.dependsOn = params.dependsOn ?? []
    this.uniqueOn = params.uniqueOn ?? []
  }

  addDefaultColumns(
    columns: FictionDbCol[] | readonly FictionDbCol[],
  ): FictionDbCol[] {
    const tsCols = this.timestamps
      ? [
          new FictionDbCol({
            key: 'createdAt',
            create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()),
            default: () => '',
          }),
          new FictionDbCol({
            key: 'updatedAt',
            create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()),
            default: () => '',
          }),
        ]
      : []

    return [...columns, ...tsCols]
  }

  createColumns(db: Knex) {
    let count = 0
    this.columns
      .filter(c => !c.isComposite)
      .forEach(async (col) => {
        const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.pgKey)
        if (!hasColumn) {
          await db.schema.table(this.pgTableKey, t => col.createColumn(t, db))
          count++
        }
      })

    if (count > 0)
      this.log.info(`DB: ${count} columns created`)
  }

  async create(db: Knex): Promise<void> {
    const tableExists = await db.schema.hasTable(this.pgTableKey)
    if (tableExists) {
      this.createColumns(db)
    }
    else {
      this.log.info(`creating table: ${this.pgTableKey}`)
      await db.schema.createTable(this.pgTableKey, (t) => {
        this.columns.forEach(async col => col.createColumn(t, db))

        if (this.uniqueOn && this.uniqueOn.length > 0)
          t.unique(this.uniqueOn)

        if (this.onCreate)
          this.onCreate(t)
      })
    }
  }

  validateRow(args: { row: Record<string, any>, action: 'create' | 'update' }): Record<string, any> {
    const { row, action } = args
    const validationErrors: string[] = []
    const validatedRow: Record<string, any> = {}

    this.columns.forEach(({ key, zodSchema, isSetting }) => {
      // Skip validation and inclusion for 'isSetting' columns during update action
      if (action === 'update' && isSetting)
        return

      const value = row[key]

      // If Zod schema exists, validate and parse the value
      if (zodSchema) {
        try {
          validatedRow[key] = zodSchema.parse(value)
        }
        catch (error) {
          const errorMessage = error instanceof ZodError
            ? error.errors.map(e => e.message).join(', ')
            : (error as Error).message || 'Unknown error'
          validationErrors.push(`Validation failed for ${key}: ${errorMessage}`)
        }
      }
      else {
        // If no Zod schema, assign the value directly
        validatedRow[key] = value
      }
    })

    // Throw an error if any validation errors were collected
    if (validationErrors.length > 0)
      throw new Error(`Row validation failed: ${validationErrors.join('; ')}`)

    return validatedRow
  }
}
