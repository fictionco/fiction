import { createRequire } from "module"
import path from "path"
import { appBuildTests } from "@factor/api/test-utils"
import { safeDirname } from "@factor/api"
const require = createRequire(import.meta.url)
appBuildTests({
  cwd: safeDirname(import.meta.url, ".."),
})
