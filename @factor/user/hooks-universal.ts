import { addPostType } from "@factor/api/post-types"
import { schemaDefinition, schemaMiddleware } from "./schema"
import userIcon from "./img/users.svg"
import { setting } from "@factor/api"

addPostType({
  postType: "user",
  managePosts: true,
  icon: userIcon,
  nameIndex: "Users",
  nameSingle: "User",
  namePlural: "Users",
  listTemplate: setting("factorUser.dashboard.list"),
  editTemplate: setting("factorUser.dashboard.edit"),
  baseRoute: setting("factorUser.baseRoute"),
  accessLevel: 500,
  noAddNew: true,
  schemaDefinition,
  schemaMiddleware,
  schemaPopulated: {
    covers: "single",
  },
  permissions: {
    retrieve: { accessLevel: 0 },
  },
})
