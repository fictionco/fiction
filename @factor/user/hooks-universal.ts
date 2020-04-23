import { addPostSchema } from "@factor/post/util"
import { addPostType } from "@factor/api/post-types"
import userSchema from "./schema"

addPostSchema(() => userSchema())

addPostType({
  postType: "user",
  icon: require("./img/users.svg"),
  nameIndex: "Users",
  nameSingle: "User",
  namePlural: "Users",
  listTemplate: (): Promise<any> => import("./v-list.vue"),
  editTemplate: (): Promise<any> => import("./v-edit.vue"),
  baseRoute: "@",
  accessLevel: 500,
  noAddNew: true,
})
