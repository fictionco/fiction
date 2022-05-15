import { Knex } from "knex"
import { snakeCase } from "@factor/api/utils"
import { log } from "../plugin-log"

type CreateCol = (params: {
  schema: Knex.AlterTableBuilder
  column: FactorDbColumn<string, unknown>
  db: Knex
}) => void

type FactorDbColumnParams<T extends string, U> = {
  columnKey: T
  type: U
  description?: string
  create: CreateCol
}
export class FactorDbColumn<T extends string, U> {
  readonly columnKey: T
  readonly type?: U
  readonly description?: string
  create: CreateCol
  constructor(params: FactorDbColumnParams<T, U>) {
    const { description } = params || {}
    this.description = description
    this.columnKey = snakeCase(params.columnKey) as T
    this.create = params.create
  }

  createColumn(schema: Knex.AlterTableBuilder, db: Knex): void {
    return this.create({ schema, column: this, db })
  }
}
type FactorDbTableParams<T extends string> = {
  tableKey: T
  columns: FactorDbColumn<string, any>[]
}

export class FactorDbTable<T extends string> {
  readonly tableKey: T
  readonly pgKey: string
  columns: FactorDbColumn<string, any>[]

  constructor(params: FactorDbTableParams<T>) {
    this.tableKey = snakeCase(params.tableKey) as T
    this.pgKey = snakeCase(params.tableKey)
    this.columns = params.columns
  }

  createColumns(db: Knex) {
    this.columns.forEach(async (col) => {
      const hasColumn = await db.schema.hasColumn(this.tableKey, col.columnKey)

      if (!hasColumn) {
        log.info("FactorDbTable", `creating column: ${col.columnKey}`)
        await db.schema.table(this.tableKey, (t) => col.createColumn(t, db))
      }
    })
  }

  async create(db: Knex): Promise<void> {
    const tableExists = await db.schema.hasTable(this.tableKey)
    if (!tableExists) {
      log.info("FactorDbTable", `creating table: ${this.tableKey}`)
      await db.schema.createTable(this.tableKey, (t) => {
        this.columns.forEach(async (col) => col.createColumn(t, db))
      })
    } else {
      this.createColumns(db)
    }
  }
}
