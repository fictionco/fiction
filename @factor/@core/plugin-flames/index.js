export default Factor => {
  return new class {
    constructor() {}

    async flame({ action, key, id }) {
      id = id || this.current().id
      const data = {
        [key]: action == "add" ? true : null
      }
      const query = {
        table: "posts",
        id,
        query: {
          table: "meta",
          id: "flames",
          data
        }
      }

      return await Vue.$db.query(query)
    }

    async flameStatus({ key, id }) {
      id = id || this.current().id

      const query = {
        table: "posts",
        id,
        query: {
          table: "meta",
          id: "flames"
        }
      }

      const flames = await Vue.$db.query(query)
      const { updatedAt, ...cleanFlames } = Vue.$lodash.pickBy(flames)

      return {
        count: Object.keys(cleanFlames).length,
        added: !!cleanFlames[key],
        updatedAt
      }
    }
  }()
}
