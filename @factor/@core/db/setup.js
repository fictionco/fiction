export default Factor => {
  return new (class {
    constructor() {
      // CLI admin setup utility
      Factor.$filters.add("cli-add-setup", (_, { privateConfig }) => {
        const setupAdmins = {
          name: "DB Connection - Add/edit the connection string for MongoDB",
          value: "db",
          callback: async ({ inquirer }) => {
            const questions = [
              {
                name: "connection",
                message: "What's your MongoDB connection string? (mongodb://...)",
                type: "input",
                default: privateConfig.DB_CONNECTION
              }
            ]

            let { connection } = await inquirer.prompt(questions)

            await Factor.$setup.writeConfig(".env", { DB_CONNECTION: connection })
          }
        }

        return [..._, setupAdmins]
      })
    }
  })()
}
