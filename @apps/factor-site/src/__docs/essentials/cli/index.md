---
title: CLI and Commands
description: Build, serve, and control Factor with commands and CLI tools.
---

# CLI and Commands

The CLI is the primary way of building, serving and controlling Factor from your terminal or the terminal of your host.

## Installing The CLI

If you've installed `@factor/core` in your project, then you've already installed and configured the Factor CLI.

Once Factor itself is installed, you should be able to run Factor commands on that project using:

```bash
npx factor <command>
```

> **Tip:** For running executable commands, `npx` and `yarn` are interchangeable.

## Standard Commands

### Running Development Server

The aptly named `dev` command starts your local development server and runs Factor in development mode.

```bash
# Run dev server
npx factor dev
```

![Dev Server is Running](./cli.jpg)

#### Dev Server Options

- **Use Static Files** `--static-files`
  Use static files instead of Webpack's default memory filesystem (virtual files).
- **Server Restart On Change** `--watch-server`
  Server development mode. Restart the server on file changes.
- **Node Inspector** `--inspector`
  Open a port for the Node Inspector. Which allows debugging with Chrome developer tools, VSCode debugger, etc..

### Running Application Build

The `factor build` command will generate all production files and place them in the `dist` folder within your app. These are the files you'll be serving in production.

```bash
npx factor build
```

This can sometimes take a while as Webpack needs to optimize, analyze, and compress all files into a bundle that is served to your visitors in production.

### Running Production Server

To run your server in production mode, all you need to do is run:

```bash
npx factor serve
```

Note that for this command to work appropriately you'll need to make sure you build the app for production first. If you'd like to do both building and serving for production in one command use `npx factor start`

### Running Build Then Production Server

As mentioned above, to build and then serve for production use:

```bash
npx factor start
```

## Standard CLI Options

- **Set Port** `--PORT`
  Set the port used for the server
- **Use Offline Mode** `--offline`
  Run in offline mode. If no internet connection is detected, this is set by default.
- **Developer Tool Inspector** `--inspect`
  Open Node Inspector on a port. Allows developer tools to work with node for inspecting variables.
- **Set Factor Environment** `--ENV`
  Set the `FACTOR_ENV` environmental variable, useful for testing, etc... (Defaults to same value as NODE_ENV)
- **Debug Mode** `--debug`
  Outputs additional debugging information into your console where possible.

## Commands from extensions

Many extensions add or extend CLI functionality to help you accomplish tasks related to that plugin. For example, a database extension might allow you to download a backup via CLI. Commands added from extensions are used with the `run` command.

```bash
npx factor run <extension-command>
```

If you're an advanced developer or building extensions for yourself and others, learn how to do this yourself in the document on [extending the CLI](./extend-the-cli)

## Resources

### Mac

- [OhMyZsh](https://github.com/ohmyzsh/ohmyzsh)
- [Spaceship Prompt](https://github.com/denysdovhan/spaceship-prompt)
