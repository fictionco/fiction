import { expect, test, describe } from "vitest"
import { execaCommandSync } from "execa"

test("builds", () => {
  const r = execaCommandSync(
    "npm exec -w @factor/site -- factor prerender --port 3434",
    {
      env: { TEST_ENV: "unit" },
    },
  )

  expect(r.stdout).toContain("built successfully")
})
