import { createRequire } from "module"
import path from "path"
import { appBuildTests } from "@factor/api/test-utils"
const require = createRequire(import.meta.url)
appBuildTests({
  cwd: path.dirname(require.resolve("@factor/site/package.json")),
})
