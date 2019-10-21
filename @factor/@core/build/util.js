import loaderUtility from "./loaders"

export function buildLoaders() {
  return loaderUtility().generateLoaders()
}

export function getExtensions() {
  return loaderUtility().getExtensions()
}

export function getFactorDirectories() {
  return loaderUtility().getFactorDirectories()
}
