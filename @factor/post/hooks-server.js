import Factor from "@factor/core"
import { addCallback, pushToFilter } from "@factor/tools"
import { $DB } from "./database"
import { $PostServer } from "./endpoint"
import { writeConfig } from "@factor/setup"
addCallback("endpoints", { id: "posts", handler: $PostServer })

if (process.env.DB_CONNECTION) {
  addCallback("initialize-server", () => $DB.initialize())
  addCallback("close-server", () => $DB.dbDisconnect())
}

addCallback("initialize-server", () => {
  // ADD CLI
  if (!process.env.DB_CONNECTION) {
    pushToFilter("setup-needed", {
      title: "DB Connection",
      value: "Needed for auth, users, posts, dashboard, etc...",
      location: ".env / DB_CONNECTION"
    })

    return
  }

  pushToFilter("cli-add-setup", () => {
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

        await writeConfig(".env", { DB_CONNECTION: connection })
      }
    }
  })
})
