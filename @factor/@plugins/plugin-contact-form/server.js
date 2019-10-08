export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.push("data-schemas", () => require("./schema").default(Factor), {
        key: "contact-form"
      })
    }
  })()
}
