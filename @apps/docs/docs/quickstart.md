# Quickstart

## Overview

If you're familiar with the basics of Javascript apps then starting a Factor app is straight-forward. The goal is to get you up-and-running in **less than 3-minutes**.

To add Factor to an existing project, all that is needed is to add `@factor/core` as a dependency in your `package.json` file. Doing this will install the CLI and all other libraries Factor needs.

To help set up an example application quickly, we've created **create-factor-app** scaffolding tool. With a simple command in your terminal, this tool will download and install Factor, then help you set up a basic application. Let's try it!

![Getting Started](./img/getting-started.svg)

### Before You Start

- Factor requires [Node.js](https://nodejs.org/en/) version 10 or above, as well as [Yarn](https://yarnpkg.com/en/) for dependency management.
- If you're using Windows you might need to install [standard build tools](https://github.com/felixrieseberg/windows-build-tools) which includes Python, etc.
- Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since NPM `5.2.0`)

## [Using `create-factor-app`](#create-factor-app)

To run `create-factor-app` all you need to do is type the following command in your terminal and press enter.

```bash
npx create-factor-app <project-name>
```

or with Yarn:

```bash
yarn create factor-app <project-name>
```

This will install Factor and start a guide that helps you create a starter app.

Once you've set up, the next step is to navigate to the project folder and launch it with:

```bash
cd <project-name>
yarn factor dev
```

Now your basic starter application should be running at [`localhost:3000`](localhost:3000)

## Next Steps

**Keep up the good work!**

Now that you have Factor running locally, the next step is to [setup your dashboard &rarr;](./dashboard-setup)
