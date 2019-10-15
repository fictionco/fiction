import Factor from "@factor/core"

export default () => {
  if (!process.env.DB_CONNECTION) {
    Factor.$filters.push("setup-needed", {
      title: "DB Connection",
      value: "Needed for auth, users, posts, dashboard, etc...",
      location: ".env / DB_CONNECTION"
    })

    return
  }

  Factor.$filters.push("cli-add-setup", () => {
    return {
      name: "DB Connection - Add/edit the connection string for MongoDB",
      value: "db",
      callback: async ({ inquirer }) => {
        const questions = [
          {
            name: "connection",
            message: "What's your MongoDB connection string? (mongodb://...)",
            type: "input",
            default: process.env.DB_CONNECTION
          }
        ]

        let { connection } = await inquirer.prompt(questions)

        await Factor.$setup.writeConfig(".env", { DB_CONNECTION: connection })
      }
    }
  })
}
