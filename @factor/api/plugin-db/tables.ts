import { FactorDbColumn, FactorDbTable } from "./objects"

export const versionTable = new FactorDbTable({
  tableKey: "factor_version",
  columns: [
    new FactorDbColumn({
      columnKey: "versionId",
      type: "", // dummy for type
      create: ({ schema, column }) => {
        schema.increments(column.columnKey).primary()
      },
    }),
    new FactorDbColumn({
      columnKey: "versionName",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "versionNumber",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey).unique(),
    }),
    new FactorDbColumn({
      columnKey: "requires",
      type: [""], // dummy for type
      create: ({ schema, column }) =>
        schema.specificType(column.columnKey, "text ARRAY"),
    }),
    new FactorDbColumn({
      columnKey: "createdAt",
      type: "", // dummy for type
      create: ({ schema, column }) => {
        schema
          .timestamp(column.columnKey)
          .notNullable()
          .defaultTo("CURRENT_TIMESTAMP")
      },
    }),
    new FactorDbColumn({
      columnKey: "updatedAt",
      type: "", // dummy for type
      create: ({ schema, column }) => {
        schema
          .timestamp(column.columnKey)
          .notNullable()
          .defaultTo("CURRENT_TIMESTAMP")
      },
    }),
  ],
})
