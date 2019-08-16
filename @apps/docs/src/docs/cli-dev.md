# Extending the CLI

If you're familiar with Factor's [filters system](./factor-framework#pluginjs-and-filters-system), then it's simple to add custom CLI commands for users of your app or extension.

Some use cases for this might be generating backup files, data downloads, creating deployment helpers, etc. Let's walk through how it's done.

## Add A Custom Command

To add a custom CLI command, you just need to add a special filter using the `cli-run-` prefix on the filter ID.

The special custom CLI command filter is provided two special arguments:

`program` - is the arguments and values from [Commander JS](https://github.com/tj/commander.js)

`inquirer` - is an instance of the [Inquirer CLI utility](https://github.com/SBoudrias/Inquirer.js)

The program argument is designed to pass along all the user's arguments and other information from the CLI.

The inquirer instance is useful to help create a dynamic interface for getting additional information from your user in an intuitive way. E.g. a file name or an option value.

> Tip: Using inquirer instead of simple CLI options means that users won't have to do guesswork.

Example:

```javascript
// index.js
module.exports.default = Factor => {
  return new class {
    constructor() {

      Factor.$filters.callback("cli-run-database-import", args => this.databaseImport(args))
    }


    async databaseImport({program, inquirer}){
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
  }
}
```

## Add Custom Setup (`factor setup`)

Many extensions require unique information from users. For example, API keys or user information for interfacing with an external service.

Setting this up can be a painful experience for end-users. Factor's setup utility is designed to solve this problem. It helps guide users and prevents the guesswork around what is needed and how exactly to set it up.

To add a custom command, all that is needed a filter. When a user selects your option, you will be provided the [Commander](https://www.npmjs.com/package/commander) program and [Inquirer utility](https://www.npmjs.com/package/inquirer) to work with.

Using those tools, gather the information you need from your user. Return the information to write in an object following the format:

```js
// returned write object for .env
return {
  private: {
    VAR_TO_WRITE: "VAL"
  }
}
// returned write object for factor-config.json
return {
  public: {
    configValToWrite: "VAL"
  }
}
```

### Example

```js
// server.js
Factor.$filters.push("cli-add-setup", ({ privateConfig }) => {
  return {
    // Name of selection
    name: "DB Connection - Add/edit the connection string for MongoDB",
    // Value if selected
    value: "db",
    // What happens if user selects your setup option
    // provided both the CLI program (commander) and Inquirer utilities
    callback: async ({ program, inquirer }) => {
      const questions = [
        {
          name: "connection",
          message: "What's your MongoDB connection string? (mongodb://...)",
          type: "input",
          default: privateConfig.DB_CONNECTION
        }
      ]

      let { connection } = await inquirer.prompt(questions)

      let write = { ".env": { DB_CONNECTION: connection } }

      return write
    }
  }
})
```
