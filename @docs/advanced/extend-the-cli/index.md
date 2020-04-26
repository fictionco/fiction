---
title: Extending the CLI
description: Add additional functionality to Factor CLI
---

# Extend the CLI 

Sometimes you may want to add a command-line utility for users of your plugin or theme. An example use case would be to generate backups or downloads in CSV format. 

You can easily create a `factor run` command using a filter. 

## Add A Custom Command

To add a custom CLI command, you just need to add a special callback using the `cli-run-` prefix on the filter ID. The command will then be available when running: 

```bash
npx factor run <command>
```

When the callback is called, it is passed other arguments provided to the command line.

To create the command: 

```javascript
// index
import { addCallback } from "@factor/api"
import inquirer from "inquirer" // https://github.com/SBoudrias/Inquirer.js

addCallback("cli-run-database-import", cliArguments => databaseImport(cliArguments))

export const databaseImport = async (cliArguments) => {
  const questions = [
    {
      name: "file",
      message: "What is the path to the file for import?",
      type: "input"
    }]

    const answers = await inquirer.prompt(questions)

    const data = await require("fs-extra").readJson(resolve(process.cwd(), answers.file))

    // Import data...
  ]
}
```

Now, to call the command :

```bash
npx factor run database-import
```
 
> Tip: We recommend using the [Inquirer CLI utility](https://github.com/SBoudrias/Inquirer.js) for CLI inputs from users
