---
title: QuickStart
description: Get started with Factor in 10 minutes or less
---

You can learn the basics for Factor in around 10 minutes. In this document, we'll discuss the hello world example as well as go through the basic ideas needed to create an app.

## Before You Start

Before you get started, you'll need the following:

- NodeJS version 14 or newer installed.
- Familiarity with NPM, terminal, basic NodeJS apps (`package.json`, `node_modules`)
- A working knowledge of latest TypeScript/JavaScript and basic VueJS

## Hello World

The fastest way to see Factor working is to download and run the hello world example. You can reference the files in this project to see the basic ingredients needed.

[Hello World Example &rarr;](https://github.com/FactorJS/factor-hello-world)

## Creating a Simple App

To create a basic app, just create a folder and type `npm init`. This will walk you through the steps of creating an initial `package.json`.

### Install Factor CLI

To install Factor and its dependencies, just install the `@factor/cli` module into your project:

```bash
npm install @factor/cli
```

### Setting Up Source

In a Factor project, there are the following "entry files",

- `index.ts` - Application entry file
- `App.vue` - UI Entry file
- `index.html` - HTML scaffold file (all pages)

If you plan on running an endpoint server:

- `server.ts` - Endpoint server entry file (optional)

The entry files must exist in the same folder.

Copy these files from the [Hello World example](https://github.com/FactorJS/factor-hello-world) into a folder called `src` and let `package.json` know how to find them by adding `main: src/index.ts`.

```json
{
  "name": "my-app",
  "main": "src/index.ts"
}
```

### Add Config Files

In the root of your project, you can now add configuration files:

- [Factor](https://www.factor.so) as `factor.config.ts`
- [Vite](https://vitejs.dev/) as `vite.config.ts` (optional but recommended)
- [TailwindCSS](https://tailwindcss.com/) as `tailwind.config.ts` (optional but recommended)

Documentation for Vite/Tailwind is on their website. As for Factor, you can read the configuration documentation.

Once set up your project structure should look like this:

```bash
📂root
 ┣ 📂node_modules
 ┣ 📂src
 ┃ ┣ 📄App.vue
 ┃ ┣ 📄index.html
 ┃ ┣ 📄index.ts
 ┃ ┣ 📄server.ts
 ┣ 📄factor.config.ts
 ┣ 📄tailwind.config.js
 ┣ 📄vite.config.ts
 ┣ 📄package.json
```

> You may also want to add standard files such as `.gitignore` and `.eslintrc`, etc.. Reference example projects for additional help getting those set up.

### Routes and Components

Now we are ready to start adding routes and "view" component to associate with those routes.

The `index.ts` entry file should export a function with the name `setup` which returns an object of runtime configuration information. One important property is `routes`. Here just return the entire `vue-router` route array which should tie routes to their respective components.

```ts
// index.ts
import { UserConfigApp } from "@factor/api"

export const setup = (): UserConfigApp => {
  return {
    routes: [
      {
        path: "/",
        component: () => import("./Home.vue"),
      },
    ],
    plugins: [],
  }
}
```

> You'll want to make sure you have your `App.vue` and `Home.vue` (added via routes) set up as standard Vue3 SFCs, if you'd like this to run correctly. [Hello World example](https://github.com/FactorJS/factor-hello-world)

## Run Factor

With these basic files, you're all setup to run Factor. Just run the following command:

```bash
npx factor dev
```
