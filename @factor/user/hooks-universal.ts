import { pushToFilter } from "@factor/tools"
import userSchema from "./schema"

pushToFilter("data-schemas", () => userSchema())
