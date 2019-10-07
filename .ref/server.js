export default Factor => {
  return new (class {
    constructor() {
      Factor.$paths.add({
        fallbacks: __dirname
      })
    }
  })()
}
