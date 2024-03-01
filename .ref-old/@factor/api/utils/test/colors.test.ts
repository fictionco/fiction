import { describe, it, expect } from "vitest"
import { tailwindVarColorScheme } from "../colors"

describe("colors", () => {
  it("gets correct tailwind config", async () => {
    const result = tailwindVarColorScheme({ variable: "foo", color: "slate" })

    expect(result).toMatchInlineSnapshot(`
      {
        "0": "var(--foo-0, rgb(255,255,255 / <alpha-value>))",
        "100": "var(--foo-100, rgb(241,245,249 / <alpha-value>))",
        "1000": "var(--foo-1000, rgb(0,0,0 / <alpha-value>))",
        "200": "var(--foo-200, rgb(226,232,240 / <alpha-value>))",
        "300": "var(--foo-300, rgb(203,213,225 / <alpha-value>))",
        "400": "var(--foo-400, rgb(148,163,184 / <alpha-value>))",
        "50": "var(--foo-50, rgb(248,250,252 / <alpha-value>))",
        "500": "var(--foo-500, rgb(100,116,139 / <alpha-value>))",
        "600": "var(--foo-600, rgb(71,85,105 / <alpha-value>))",
        "700": "var(--foo-700, rgb(51,65,85 / <alpha-value>))",
        "800": "var(--foo-800, rgb(30,41,59 / <alpha-value>))",
        "900": "var(--foo-900, rgb(15,23,42 / <alpha-value>))",
        "950": "var(--foo-950, rgb(9,14,27 / <alpha-value>))",
        "DEFAULT": "var(--foo-500, rgb(100,116,139 / <alpha-value>))",
      }
    `)
  })
})
