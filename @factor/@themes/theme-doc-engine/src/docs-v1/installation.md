# Installation
Factor.js is really easy to get started with. A simple project only needs the `factor` dependency.

## [Using `factor start`](#using-factor-start)

To get started quickly, the Factor.js team has created scaffolding tool [factor start](link).

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since NPM `5.2.0`)

```bash
$ yarn factor start <project-name>
```

It will ask you some questions:

1. Choose your theme:
  - [One](Link)
  - [Two](Link)
  - [Three](Link)
  - [Four](Link)
2. Choose your stack:
  - [One](Link)
  - [Two](Link)
  - [Three](Link)
  - [Four](Link)

When answered, it will install all the dependencies so the next step is to navigate to the project folder and launch it with:

```bash
$ cd <project-name>
$ yarn factor dev
```

The application is now running on http://localhost:3000.

> Factor.js will listen for file changes inside the `src` directory, so there is no need to restart the application when adding new pages.

To discover more about the directory structure of the project: [Directory Structure Documentation](/docs/directory-structure).

## [Starting from scratch](#starting-from-scratch)

Creating a Factor.js application from scratch is also really easy, it only needs *1 file and 1 directory*. Let's create an empty directory to start working on the application:

```bash
$ mkdir <project-name>
$ cd <project-name>
```

> Info: replace `<project-name>` by the name of the project.

### [Installing `factor`](#installing-factor)

Once the `package.json` has been created, add `factor` to the project via yarn:

```bash
$ yarn add factor
```

### [The `pages` directory](#the-pages-directory)

Factor.js will transform every `*.vue` file inside the `pages` directory as a route for the application.

Create the `pages` directory:

```bash
$ mkdir pages
```

then create the first page in `pages/index.vue`:

```html
<template>
  <h1>Hello world!</h1>
</template>
```

and launch the project with:

```bash
$ yarn factor dev
```

The application is now running on http://localhost:3000.

> Factor.js will listen for file changes inside the <code>pages</code> directory, so there is no need to restart the application when adding new pages.

To discover more about the directory structure of the project: [Directory Structure Documentation](/docs/directory-structure).