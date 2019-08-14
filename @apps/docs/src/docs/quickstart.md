# Installation

## Famous 5-Minute Install

Starting a new Factor app is easy. The goal is to have you up-and-running in **less than 3-minutes**.

A simple project only needs `@factor/core` referenced as a package.json dependency. This installs Factor CLI as well as some packages. Let's dig in...

> **Node + Yarn - Global Dependencies** <br/>
> Factor requires [Node.js](https://nodejs.org/en/) version 10 or above, as well as [Yarn](https://yarnpkg.com/en/) for dependency management.

## [Using `create-factor-app`](#create-factor-app)

To get started quickly, we've built a "starter kit" tool: [create-factor-app](https://www.npmjs.com/package/create-factor-app).

> Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since NPM `5.2.0`)

```bash
$ npx create-factor-app <project-name>
```

or with Yarn:

```bash
$ yarn create factor-app <project-name>
```

Running this command will install Factor and start a guide that helps you create a starter app.

It will ask you a couple questions and then it will install and create a basic Factor app.

Once you've set up, the next step is to navigate to the project folder and launch it with:

```bash
$ cd <project-name>
$ yarn factor dev
```

Now your basic starter application should be running at [`localhost:3000`](localhost:3000)

## Next Steps

Now that you have Factor running on your local server, the next step is to [setup your dashboard](./dashboard-setup) and then learn [how to use plugins and themes](./extension-basics).

Keep up the good work!
