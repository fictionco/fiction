import { pushToFilter } from "@factor/tools"
import contactFormSchema from "./schema"
pushToFilter("data-schemas", () => contactFormSchema)
