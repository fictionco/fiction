import { Knex } from "knex"
import { snakeCase } from "@factor/api/utils"
import { log } from "../plugin-log"

type CreateCol = (params: {
  schema: Knex.AlterTableBuilder
  column: FactorDbCol
  db: Knex
}) => void

export type FactorDbColSettings = {
  readonly key: string
  description?: string
  create: CreateCol
}
export class FactorDbCol<T = unknown> {
  readonly type?: T
  readonly key: string
  readonly pgKey: string
  readonly description?: string
  create: CreateCol
  constructor(params: FactorDbColSettings) {
    const { description } = params || {}
    this.description = description
    this.key = params.key
    this.pgKey = snakeCase(params.key)
    this.create = params.create
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
  columns: readonly FactorDbCol[]

  constructor(params: FactorDbTableSettings) {
    this.tableKey = params.tableKey
    this.pgTableKey = snakeCase(params.tableKey)

    const tsCols = params.timestamps
      ? [
          new FactorDbCol({
            key: "createdAt",
            create: ({ schema, column }) => {
              schema
                .timestamp(column.pgKey)
                .notNullable()
                .defaultTo("CURRENT_TIMESTAMP")
            },
          }),
          new FactorDbCol({
            key: "updatedAt",
            create: ({ schema, column }) => {
              schema
                .timestamp(column.pgKey)
                .notNullable()
                .defaultTo("CURRENT_TIMESTAMP")
            },
          }),
        ]
      : []

    this.columns = [...params.columns, ...tsCols]
  }

  createColumns(db: Knex) {
    this.columns.forEach(async (col) => {
      const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.pgKey)

      if (!hasColumn) {
        await db.schema.table(this.pgTableKey, (t) => col.createColumn(t, db))
      }
    })
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
