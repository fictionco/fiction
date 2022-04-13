import { appBuildTests } from "@factor/api/test-utils"
import { safeDirname } from "@factor/api"
appBuildTests({
  cwd: safeDirname(import.meta.url, ".."),
})
