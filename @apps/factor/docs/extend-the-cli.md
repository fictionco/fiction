# Extending the CLI

If you're familiar with Factor's [filters system](./filters-callbacks-events), then it's simple to add custom CLI commands for users of your app or extension.

Use cases for this might be generating backup files, data downloads, creating deployment helpers, etc.

## Add A Custom Command

To add a custom CLI command, you just need to add a special filter using the `cli-run-` prefix on the filter ID.

In this filter you'll get an argument that includes all the user's arguments and other information from the CLI.

> Tip: We recommend using the [Inquirer CLI utility](https://github.com/SBoudrias/Inquirer.js) for CLI inputs from users

Example:

```javascript
// index
import { addCallback } from "@factor/api"
import inquirer from "inquirer" // https://github.com/SBoudrias/Inquirer.js

addCallback("cli-run-database-import", args => databaseImport(args))

export async function databaseImport(){
  const questions = [
    {
      name: "file",
      message: "What is the path to the file for import?",
      type: "input"
    },
    {
      name: "collection",
      message: "Which collection should we import to?",
      type: "input"
    }]

    const answers = await inquirer.prompt(questions)

    const data = await require("fs-extra").readJson(resolve(process.cwd(), answers.file))

    // Import data...
  ]
}
```

## Add Custom Setup (`factor setup`)

Many extensions require unique information from users. For example, API keys or user information for interfacing with an external service.

Setting config can be painful for end-users and the setup utility is designed to make it easy by reducing guesswork.

To add a custom command, all that is needed a filter.

### Example

```js
// server.js
import { writeConfig } from "@factor/cli/setup"
import { pushToFilter } from "@factor/api"
import inquirer from "inquirer" // https://github.com/SBoudrias/Inquirer.js

pushToFilter("cli-add-setup", () => {
  return {
    name: "DB Connection - Add/edit the connection string for MongoDB",
    value: "db",
    callback: async program => {
      const questions = [
        {
          name: "connection",
          message: "What's your MongoDB connection string? (mongodb://...)",
          type: "input",
          default: process.env.DB_CONNECTION
        }
      ]

      let { connection } = await inquirer.prompt(questions)

      await writeConfig("private", { DB_CONNECTION: connection })
    }
  }
})
```

### Writing Config

As in the example above, to write to the app's private or public config, use `writeConfig` as follows:

```js
import { writeConfig } from "@factor/cli/setup"
// PRIVATE CONFIG: .env
await writeConfig("private", {
  SOME_PRIVATE_SETTING: "VALUE"
})

// PUBLIC CONFIG: package.json
await writeConfig("public", {
  some_setting: "value"
})
```
