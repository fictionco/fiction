import type { Knex } from 'knex'
import type { ZodSchema } from 'zod'
import { ZodError, z } from 'zod'
import { toSnakeCase } from '../utils/index.js'
import type { LogHelper } from '../plugin-log/index.js'
import { log } from '../plugin-log/index.js'
import { FictionObject } from '../plugin.js'

export type ColDefaultValue = Knex.Value | undefined
type SecurityType = 'permanent' | 'setting' | 'authority' | 'admin' | 'private' | 'composite'

type MakeCol = (params: { s: Knex.AlterTableBuilder, col: Col, db: Knex }) => void
export type ColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> = {
  key: U
  make: MakeCol
  sec?: SecurityType
  sch: (args: { z: typeof z }) => ZodSchema<T>
}
export class Col<U extends string = string, T extends ColDefaultValue = ColDefaultValue> extends FictionObject<ColSettings<U, T>> {
  k = toSnakeCase(this.settings.key)
  sec = this.settings.sec || 'setting'
  constructor(settings: ColSettings<U, T>) {
    super('Col', settings)
  }

  createColumn(schema: Knex.AlterTableBuilder, db: Knex): void {
    return this.settings.make({ s: schema, col: this, db })
  }
}

type CreateCol = (params: { schema: Knex.AlterTableBuilder, column: FictionDbCol, db: Knex }) => void
type PrepareForStorage<T extends ColDefaultValue = ColDefaultValue> = (args: { value: T, key: string, db: Knex }) => unknown

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
    return this.create({ schema, column: this, db })
  }
}
export interface FictionDbTableSettings {
  tableKey: string
  timestamps?: boolean
  columns?: readonly FictionDbCol[]
  cols?: readonly Col[]
  dependsOn?: string[]
  onCreate?: (t: Knex.AlterTableBuilder) => void
  uniqueOn?: string[]
}

export class FictionDbTable {
  readonly tableKey: string
  readonly pgTableKey: string
  columns: FictionDbCol[]
  cols: Col[]
  log: LogHelper
  timestamps: boolean
  dependsOn: string[]
  onCreate?: (t: Knex.AlterTableBuilder) => void
  uniqueOn?: string[]
  constructor(params: FictionDbTableSettings) {
    this.tableKey = params.tableKey
    this.pgTableKey = toSnakeCase(params.tableKey)
    this.log = log.contextLogger(`FictionDbTable:${this.tableKey}`)
    this.timestamps = params.timestamps ?? false
    this.onCreate = params.onCreate
    this.columns = this.legacyAddDefaultColumns(params.columns || [])
    this.cols = this.addStandardCols((params.cols || []) as Col[])
    this.dependsOn = params.dependsOn ?? []
    this.uniqueOn = params.uniqueOn ?? []
  }

  addStandardCols(cols: Col[] = []) {
    const tsCols = [
      new Col({ key: 'createdAt', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).notNullable().defaultTo(db.fn.now()) }),
      new Col({ key: 'updatedAt', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).notNullable().defaultTo(db.fn.now()) }),
    ]
    return [...cols, ...tsCols]
  }

  legacyAddDefaultColumns(
    columns: FictionDbCol[] | readonly FictionDbCol[],
  ): FictionDbCol[] {
    const tsCols = [
      new FictionDbCol({ key: 'createdAt', create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()), default: () => '' }),
      new FictionDbCol({ key: 'updatedAt', create: ({ schema, column, db }) => schema.timestamp(column.pgKey).notNullable().defaultTo(db.fn.now()), default: () => '' }),
    ]

    return [...columns, ...tsCols]
  }

  async createColumns(db: Knex) {
    const rows: string[] = []
    const p = this.columns.filter(c => !c.isComposite)
      .map(async (col) => {
        const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.pgKey)
        if (!hasColumn) {
          await db.schema.table(this.pgTableKey, t => col.createColumn(t, db))
          rows.push(col.pgKey)
        }
      })

    await Promise.all(p)

    const p2 = this.cols.filter(c => c.settings.sec !== 'composite').map(async (col) => {
      const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.k)
      if (!hasColumn) {
        await db.schema.table(this.pgTableKey, t => col.createColumn(t, db))
        rows.push(col.k)
      }
    })

    await Promise.all(p2)

    if (rows.length > 0)
      this.log.info(`${this.tableKey}: ${rows.length} columns created`, { data: rows })
  }

  async create(db: Knex): Promise<void> {
    const tableExists = await db.schema.hasTable(this.pgTableKey)
    if (tableExists) {
      await this.createColumns(db)
    }
    else {
      this.log.info(`creating table: ${this.pgTableKey}`)
      const promise = new Promise<void>(async (resolve) => {
        await db.schema.createTable(this.pgTableKey, async (t) => {
          await this.createColumns(db)
          resolve()
        })
      })

      await promise

      const u = this.uniqueOn
      if (u && u.length > 0) {
        await db.schema.table(this.pgTableKey, t => t.unique(u))
      }

      if (this.onCreate) {
        await db.schema.table(this.pgTableKey, t => this.onCreate?.(t))
      }
    }
  }
}
