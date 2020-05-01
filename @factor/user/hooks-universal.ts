import { addPostType } from "@factor/api/post-types"
import { schemaDefinition, schemaMiddleware } from "./schema"
import userIcon from "./img/users.svg"
addPostType({
  postType: "user",
  managePosts: true,
  icon: userIcon,
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
