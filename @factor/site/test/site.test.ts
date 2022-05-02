import { appBuildTests } from "@factor/api/testUtils"
import { safeDirname } from "@factor/api"
appBuildTests({
  cwd: safeDirname(import.meta.url, ".."),
})
