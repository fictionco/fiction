import { addPostType } from "@factor/api/post-types"
import { schemaDefinition, schemaMiddleware } from "./schema"

addPostType({
  postType: "user",
  managePosts: true,
  icon: require("./img/users.svg"),
  nameIndex: "Users",
  nameSingle: "User",
  namePlural: "Users",
  listTemplate: (): Promise<any> => import("./v-list.vue"),
  editTemplate: (): Promise<any> => import("./v-edit.vue"),
  baseRoute: "@",
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
