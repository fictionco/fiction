import loaderUtility from "./loaders"

export function generateLoaders() {
  return loaderUtility().generateLoaders()
}

export function getExtensions() {
  return loaderUtility().getExtensions()
}

export function getFactorDirectories() {
  return loaderUtility().getFactorDirectories()
}
