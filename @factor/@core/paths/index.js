export default Factor => {
  return new (class {
    constructor() {}

    get(p) {
      if (p == "app") {
        return "~"
      } else if (p == "source") {
        return "@"
      } else {
        return ""
      }
    }

    // Used for server paths. For app, just return input
    resolveFilePath(path) {
      return path
    }
  })()
}
