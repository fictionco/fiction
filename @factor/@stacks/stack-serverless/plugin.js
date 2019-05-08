module.exports = Factor => {
  return new (class {
    constructor() {
      this.db()
      this.storage()
      this.endpoints()
      this.hosting()
      this.auth()
    }

    db() {}

    storage() {}

    endpoints() {}

    hosting() {}

    auth() {}
  })()
}
