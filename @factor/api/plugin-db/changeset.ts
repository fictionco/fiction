import { Knex } from "knex"
import { snakeCase } from "../utils"
import type { FactorDBTables } from "."

const changes: ChangesetConfig = [
  {
    table: "factor_user",
    columnGroups: [
      {
        columns: [{ col: "last_project", type: "string" } as const],
        cb: (
          t: Knex.AlterTableBuilder,
          col: string,
          hasColumn: boolean,
          type?: ChangesetColumnTypes,
          specific?: string,
        ): void => {
          if (!hasColumn) {
            if (specific) {
              t.specificType(col, specific)
            } else if (type) {
              t[type](col)
            } else {
              // custom
            }
          }
        },
      },
    ],
  },
]
export type ChangesetColumnTypes = "integer" | "string" | "jsonb"

export type ChangesetColumnGroup = {
  columns: { col: string; type?: ChangesetColumnTypes; specific?: string }[]
  cb: (
    t: Knex.AlterTableBuilder,
    col: string,
    hasColumn: boolean,
    type?: ChangesetColumnTypes,
    specific?: string,
  ) => void
}

export type ChangesetConfig = {
  table: string | FactorDBTables
  columnGroups: ChangesetColumnGroup[]
}[]
/**
 * Run a changeset to existing table
 * Checks to see if column exists first
 */
export const runChangeset = async (db: Knex): Promise<void> => {
  // change table loop
  const _tableChangePromises = changes.map(async ({ table, columnGroups }) => {
    // group of columns change loop
    const _groupChangePromises = columnGroups.map(
      async (group: ChangesetColumnGroup): Promise<void> => {
        // individual column change
        const _colChangePromises = group.columns.map(
          async ({ col, type, specific }) => {
            const hasColumn = await db.schema.hasColumn(table, snakeCase(col))

            await db.schema.table(table, (t) =>
              group.cb(t, col, hasColumn, type, specific),
            )
          },
        )
        await Promise.all(_colChangePromises)
      },
    )

    await Promise.all(_groupChangePromises)
  })

  await Promise.all(_tableChangePromises)

  return
}
