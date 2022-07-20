import { Knex } from "knex"
import { snakeCase } from "../utils"
import { log } from "../plugin-log"

type CreateCol = (params: {
  schema: Knex.AlterTableBuilder
  column: FactorDbCol
  db: Knex
}) => void
type PrepareForStorage = (args: {
  value: unknown
  key: string
  db: Knex
}) => unknown
// type ColScope = "private" | "public" | "all" | "settings"

export type FactorDbColSettings = {
  readonly key: string
  description?: string
  isComposite?: boolean
  create: CreateCol
  prepare?: PrepareForStorage
  isPrivate?: boolean
  isSetting?: boolean
  isAuthority?: boolean
}
export class FactorDbCol {
  readonly key: string
  readonly pgKey: string
  readonly description?: string
  isComposite?: boolean
  create: CreateCol
  isPrivate: boolean
  isSetting: boolean
  isAuthority: boolean
  prepare?: PrepareForStorage
  constructor(settings: FactorDbColSettings) {
    const { description } = settings || {}
    this.description = description
    this.key = settings.key
    this.pgKey = snakeCase(settings.key)
    this.create = settings.create
    this.prepare = settings.prepare
    this.isComposite = settings.isComposite
    this.isPrivate = settings.isPrivate ?? false
    this.isSetting = settings.isSetting ?? false
    this.isAuthority = settings.isAuthority ?? false
  }

  createColumn(schema: Knex.AlterTableBuilder, db: Knex): void {
    log.info("FactorDbTable", `creating column: ${this.pgKey}`)
    return this.create({ schema, column: this, db })
  }
}
export type FactorDbTableSettings = {
  tableKey: string
  timestamps?: boolean
  columns: readonly FactorDbCol[]
}

export class FactorDbTable {
  readonly tableKey: string
  readonly pgTableKey: string
  columns: FactorDbCol[]
  log = log.contextLogger(this.constructor.name)
  constructor(params: FactorDbTableSettings) {
    this.tableKey = params.tableKey
    this.pgTableKey = snakeCase(params.tableKey)

    const tsCols = params.timestamps
      ? [
          new FactorDbCol({
            key: "createdAt",
            create: ({ schema, column, db }) => {
              schema
                .timestamp(column.pgKey)
                .notNullable()
                .defaultTo(db.fn.now())
            },
          }),
          new FactorDbCol({
            key: "updatedAt",
            create: ({ schema, column, db }) => {
              schema
                .timestamp(column.pgKey)
                .notNullable()
                .defaultTo(db.fn.now())
            },
          }),
        ]
      : []

    this.columns = [...params.columns, ...tsCols]
  }

  createColumns(db: Knex) {
    let count = 0
    this.columns
      .filter((c) => !c.isComposite)
      .forEach(async (col) => {
        const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.pgKey)

        if (!hasColumn) {
          await db.schema.table(this.pgTableKey, (t) => col.createColumn(t, db))
          count++
        }
      })

    this.log.info(
      count == 0 ? "DB: no changes" : `DB: ${count} columns created`,
    )
  }

  async create(db: Knex): Promise<void> {
    const tableExists = await db.schema.hasTable(this.pgTableKey)
    if (!tableExists) {
      log.info("FactorDbTable", `creating table: ${this.pgTableKey}`)
      await db.schema.createTable(this.pgTableKey, (t) => {
        this.columns.forEach(async (col) => col.createColumn(t, db))
      })
    } else {
      this.createColumns(db)
    }
  }
}
