import paths from "./server"

export function getPath(_id) {
  return paths.get(_id)
}

export function resolveFilePath(path) {
  return paths.resolveFilePath(path)
}
