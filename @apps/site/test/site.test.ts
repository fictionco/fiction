import { createRequire } from "module"
import path from "path"
import { appBuildTests } from "@factor/test"
const require = createRequire(import.meta.url)
appBuildTests({
  cwd: path.dirname(require.resolve("@factor/site/package.json")),
})
