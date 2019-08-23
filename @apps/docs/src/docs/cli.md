# Commands and CLI

A key part of using Factor is working with its command-line-interface (CLI). The CLI is used to help orchestrate tasks across the system.

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

`--PORT` - Set the desired port to serve your application. _Defaults to `3000`._

`--ENV` - Set the FACTOR_ENV environmental variable. _Defaults to `NODE_ENV`._

### Help Command

```bash
$ yarn factor help
```

Displays available commands in the CLI (from both the framework and your installed extensions).
