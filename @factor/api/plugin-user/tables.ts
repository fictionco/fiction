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
      isPrivate: true,
    }),
    new FactorDbCol({
      key: "fullName",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "firstName",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "lastName",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
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
      isSetting: true,
    }),
    new FactorDbCol({
      key: "github",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "githubFollowers",
      create: ({ schema, column }) => schema.integer(column.pgKey),
      isPrivate: true,
    }),
    new FactorDbCol({
      key: "twitter",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "twitterFollowers",
      create: ({ schema, column }) => schema.integer(column.pgKey),
      isPrivate: true,
    }),
    new FactorDbCol({
      key: "facebook",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "linkedin",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "workSeniority",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "workRole",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "bio",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "location",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "hashedPassword",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isAuthority: true,
    }),
    new FactorDbCol({
      key: "emailVerified",
      create: ({ schema, column }) =>
        schema.boolean(column.pgKey).notNullable().defaultTo(false),
    }),
    new FactorDbCol({
      key: "verificationCode",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isAuthority: true,
    }),
    new FactorDbCol({
      key: "codeExpiresAt",
      create: ({ schema, column }) => schema.dateTime(column.pgKey),
      isAuthority: true,
    }),
    new FactorDbCol({
      key: "picture",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "avatar",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "about",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "gender",
      create: ({ schema, column }) =>
        schema.enum(column.pgKey, ["male", "female", "other"]),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "birthday",
      create: ({ schema, column }) => schema.date(column.pgKey),
      isPrivate: true,
      isSetting: true,
    }),
    new FactorDbCol({
      key: "phoneNumber",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isPrivate: true,
      isSetting: true,
    }),
    new FactorDbCol({
      key: "address",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isPrivate: true,
    }),
    new FactorDbCol({
      key: "meta",
      create: ({ schema, column }) => schema.jsonb(column.pgKey),
    }),

    new FactorDbCol({
      key: "invitedById",
      create: ({ schema, column }) =>
        schema.string(column.pgKey).references(`factor_user.user_id`),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "lastProjectId",
      create: ({ schema, column }) => schema.string(column.pgKey),
      isSetting: true,
    }),
    new FactorDbCol({
      key: "lastSeenAt",
      isSetting: true,
      create: ({ schema, column, db }) =>
        schema.dateTime(column.pgKey).defaultTo(db.fn.now()),
    }),
  ],
})
