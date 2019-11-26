import userSchema from "./schema"
import { pushToFilter } from "@factor/tools"

pushToFilter("data-schemas", () => userSchema())
