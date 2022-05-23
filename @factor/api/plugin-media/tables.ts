import { FactorDbColumn, FactorDbTable } from "../plugin-db"

export const mediaTable = new FactorDbTable({
  tableKey: "factor_media",
  columns: [
    new FactorDbColumn({
      columnKey: "mediaId",
      type: "", // dummy for type
      create: ({ schema, column, db }) => {
        schema
          .string(column.columnKey)
          .primary()
          .defaultTo(db.raw(`generate_object_id()`))
      },
    }),
    new FactorDbColumn({
      columnKey: "userId",
      type: "", // dummy for type
      create: ({ schema, column }) => {
        schema
          .string(column.columnKey, 32)
          .references(`factor_user.user_id`)
          .onUpdate("CASCADE")
      },
    }),
    new FactorDbColumn({
      columnKey: "url",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "filePath",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "mime",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "width",
      type: 1, // dummy for type
      create: ({ schema, column }) => schema.integer(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "height",
      type: 1, // dummy for type
      create: ({ schema, column }) => schema.integer(column.columnKey),
    }),

    new FactorDbColumn({
      columnKey: "alt",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),

    new FactorDbColumn({
      columnKey: "contentEncoding",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "etag",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "bucket",
      type: "", // dummy for type
      create: ({ schema, column }) => schema.string(column.columnKey),
    }),
    new FactorDbColumn({
      columnKey: "size",
      type: 1, // dummy for type
      create: ({ schema, column }) => schema.integer(column.columnKey),
    }),

    new FactorDbColumn({
      columnKey: "createdAt",
      type: "", // dummy for type
      create: ({ schema, column, db }) => {
        schema
          .timestamp(column.columnKey)
          .notNullable()
          .defaultTo(db.raw("CURRENT_TIMESTAMP"))
      },
    }),
  ],
})
