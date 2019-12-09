import { addPostSchema } from "@factor/post/util"
import userSchema from "./schema"

addPostSchema(() => userSchema())
