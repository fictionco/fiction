# Commands and CLI

A key part of using Factor is working with its command-line-interface (CLI). The CLI is used to help orchestrate tasks across the system.

## Getting the CLI

1. Add Factor by adding `@factor/core` as a dependency in your project `yarn add @factor/core`
2. Run the initial `yarn install` on the directory to install dependencies
3. You should now have the CLI available in that directory using `yarn factor [command]`

## Primary Factor Commands

### Run Development Server

The aptly named `dev` command starts your local development server and runs Factor in development mode.

```bash
# Run dev server
yarn factor dev
```

### Run Production Server

Running your application on your Node server takes two steps:

1. `factor build` Build the production app (creates `dist` folder)
2. `factor serve` Serve the app

#### Examples

```bash

# Build your production app
yarn factor build

# Serve your built app
yarn factor serve [NODE_ENV]

# Build and serve your app
yarn factor start
```

### Setup Helper

Factor provides a special `setup` helper command that helps you configure any keys or information needed by Factor and/or plugins you've installed.

```bash
# Run setup utility
yarn factor setup
```

### Common CLI Options

`--PORT` - Set the desired port to serve your application. _Defaults to `3000`._

`--ENV` - Set the FACTOR\*ENV environmental variable. _Defaults to `NODE_ENV`._

#### Extensions

```bash
# If a callback is added as "cli-run-my-custom-cli"

yarn factor run my-custom-cli
```

This command runs various operations that have been added by extensions and components. Reference their documentation for specifics, read about creating a custom command below.

```bash
yarn factor setup
```

Starts the Factor setup utility. The setup utility is used to configure setting and is commonly extended by plugins to help reduce guesswork in setting things up.
