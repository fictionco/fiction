# Commands and CLI

A key part of using Factor is working with its command-link-interface (CLI). The CLI is used to help orchestrate tasks across the system.

## Primary Factor Commands 

#### Development

```bash
$ yarn factor dev
```

This command starts your local development server and runs Factor in development mode. 

#### Extensions

```bash
# If a callback is added as "cli-run-my-custom-cli"

$ yarn factor run my-custom-cli
```

This command runs various operations that have been added by extensions and components. Reference their documentation for specifics, read about creating a custom command below.

```bash
$ yarn factor setup
```

Starts the Factor setup utility. The setup utility is used to configure setting and is commonly extended by plugins to help reduce guesswork in setting things up. 

#### Production and Serving

```bash
$ yarn factor start
```

This will build your application for distribution and serve it in `production` mode. 

> This is useful in hosting environments for building and then serving. Also for testing the production version of your app.

```bash
$ yarn factor serve [environment]
```

Serves your app. Also takes an environment variable (production/development). 

```bash
$ yarn factor build
```

Builds the production application bundle.

### Standard Options

`--PORT` - Set the desired port to serve your application. *Defaults to `3000`.*

`--ENV` - Set the FACTOR_ENV environmental variable. *Defaults to `NODE_ENV`.*

### Help Command

```bash
$ yarn factor help
```

Displays available commands in the CLI (from both the framework and your installed extensions).

## Extending the CLI

If you're familiar with Factor's [filters system](./factor-framework#pluginjs-and-filters-system), then it's simple to add custom CLI commands for users of your app or extension. 

Some use cases for this might be generating backup files, data downloads, creating deployment helpers, etc. Let's walk through how it's done. 

### Adding A Custom Command

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
  return new (class {
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
  })()
}


```