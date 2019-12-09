import { extendPostSchema } from "@factor/post/util"
import userSchema from "./schema"

extendPostSchema(() => userSchema())
