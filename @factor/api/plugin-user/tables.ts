import { FactorDbCol, FactorDbTable } from "../plugin-db/objects"

export const userTable = new FactorDbTable({
  tableKey: "factor_user",
  timestamps: true,
  columns: [
    new FactorDbCol({
      key: "userId",
      create: ({ schema, column, db }) => {
        schema
          .string(column.pgKey)
          .primary()
          .defaultTo(db.raw(`generate_object_id('us')`))
      },
    }),
    new FactorDbCol({
      key: "email",
      create: ({ schema, column }) =>
        schema.string(column.pgKey).notNullable().unique(),
    }),
    new FactorDbCol({
      key: "username",
      create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    }),
    new FactorDbCol({
      key: "googleId",
      create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    }),
    new FactorDbCol({
      key: "fullName",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "firstName",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "lastName",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "role",
      create: ({ schema, column }) =>
        schema.string(column.pgKey).notNullable().defaultTo("subscriber"),
    }),
    new FactorDbCol({
      key: "status",
      create: ({ schema, column }) =>
        schema.string(column.pgKey).notNullable().defaultTo("active"),
    }),
    new FactorDbCol({
      key: "site",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "github",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "githubFollowers",
      create: ({ schema, column }) => schema.integer(column.pgKey),
    }),
    new FactorDbCol({
      key: "twitter",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "twitterFollowers",
      create: ({ schema, column }) => schema.integer(column.pgKey),
    }),
    new FactorDbCol({
      key: "facebook",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "linkedin",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "workSeniority",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "workRole",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "bio",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "location",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "hashedPassword",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "emailVerified",
      create: ({ schema, column }) =>
        schema.boolean(column.pgKey).notNullable().defaultTo(false),
    }),
    new FactorDbCol({
      key: "verificationCode",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "codeExpiresAt",
      create: ({ schema, column }) => schema.dateTime(column.pgKey),
    }),
    new FactorDbCol({
      key: "picture",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "avatar",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "about",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "gender",
      create: ({ schema, column }) =>
        schema.enum(column.pgKey, ["male", "female", "other"]),
    }),
    new FactorDbCol({
      key: "birthday",
      create: ({ schema, column }) => schema.date(column.pgKey),
    }),
    new FactorDbCol({
      key: "phoneNumber",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "address",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "meta",
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
    }),
    new FactorDbCol({
      key: "settings",
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
    }),
    new FactorDbCol({
      key: "profile",
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
    }),
    new FactorDbCol({
      key: "invitedBy",
      create: ({ schema, column }) =>
        schema.string(column.pgKey).references(`factor_user.user_id`),
    }),
    new FactorDbCol({
      key: "lastSeenAt",
      create: ({ schema, column, db }) =>
        schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    }),
  ],
})