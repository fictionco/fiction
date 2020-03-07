import { sep } from "path"

// copied from https://github.com/nuxt/consola/blob/master/src/utils/error.js
export const parseStack = (stack: string): string[] => {
  const cwd = process.cwd() + sep

  const lines = stack
    .split("\n")
    .splice(1)
    .map(l => {
      return l
        .trim()
        .replace("file://", "")
        .replace(cwd, "")
    })

  return lines
}
