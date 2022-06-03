import { FactorDbCol, FactorDbTable } from "./objects"

export const versionTable = new FactorDbTable({
  tableKey: "factor_version",
  columns: [
    new FactorDbCol({
      key: "versionId",
      create: ({ schema, column, db }) => {
        schema
          .string(column.pgKey)
          .primary()
          .defaultTo(db.raw(`generate_object_id()`))
      },
    }),
    new FactorDbCol({
      key: "versionName",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "versionNumber",
      create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    }),
    new FactorDbCol({
      key: "requires",
      create: ({ schema, column }) =>
        schema.specificType(column.pgKey, "text ARRAY"),
    }),
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
  ],
})
