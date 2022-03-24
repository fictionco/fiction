---
title: Factor App Configuration
description: The basic configuration information needed in a Factor app
---

To coordinate Factor across your development and production environments it is important to set up a few configuration settings.

The following config files are supported:

```bash
/ # root
 ┣ package.json         # standard (manifest)
 ┣ /node_modules        # standard (dependencies)
 ┣ /src                 # src folder if 'main' is set to `src/index.ts`
 ┃ ┣ App.vue            # UI entry component
 ┃ ┣ index.html         # HTML template / scaffold
 ┃ ┣ index.ts           # application entry file
 ┃ ┣ server.ts          # server entry file
 ┣ factor.config.ts     # build config
 ┣ tailwind.config.js   # tailwindCSS config
 ┣ vite.config.ts       # vite config
 ┣ .env                 # private secrets (not necessarily used in production)
```

> Note that the `src` folder is based on the location of the `index.ts` file in your `package.json` > `main` property.

## Build Config File `factor.config.ts`

Your Factor app requires a `factor.config.ts` file. This file just needs to export a default object with your Factor build (or server) settings.

We recommend you add the basic application variables for name, url, email.

This will enable server functionality like sitemaps, and transactional emails. Setting them looks like this:

```typescript
// FILE: factor.config.ts
export default {
  variables: {
    FACTOR_APP_NAME: "FactorES", // your application name
    FACTOR_APP_EMAIL: "hi@factorjs.org", // the email your application will use (SMTP)
    FACTOR_APP_URL: "https://www.factorjs.org", // the production url for your application (for sitemaps, etc.)
  },
}
```

> Anything added to the `variables` property in `factor.config.ts` will be available across your application as an environmental variable.

## Application Entry `index.ts`

The entry point for your application code is your `index.ts` main file. This file should export a function named `setup` which should return configuration for your application. The primary items you'll need to export here are application `plugins` and `routes`.

```typescript
// FILE: src/index.ts
import { doStuff } from "./do-stuff" // other custom code

export const setup = () => {
  // initialize other app code here if you'd like
  doStuff()

  // return routes, plugins and any other app settings
  return {
    routes: [],
    plugins: [],
  }
}
```

## Endpoint Server Entry `server.ts`

The entry point for your app's endpoint server is a `server.ts` in your source folder. As with your app entry file, this file should export a function named `setup` which should return configuration for your endpoint server.

The primary items you'll need to export here are server/endpoint `plugins`, url `sitemaps`, and custom `endpoints`.

```ts
// FILE: src/server.ts
import { doServerStuff } from "./server-do-stuff" // other custom code

export const setup = (): UserConfig => {
  // initialize other server code here if you'd like
  doServerStuff()

  // return routes, plugins and any other app settings
  return {
    endpoints: [],
    sitemaps: [],
    plugins: [],
  }
}
```

## Private Environmental Variables `.env`

For many secure transactions, like working with a database, you'll need to use private environmental variables. These are where you'll store sensitive data like private keys and passwords.

Most services, like Heroku or Netlify, have a standardized way of adding environmental variables in production.

In other environments, e.g. development, you'll need to set these up using `.env` files based on the [Dotenv standard](https://github.com/motdotla/dotenv#readme).

> **Note:** You should never commit `.env` files to source control (git). They are meant to be set up manually for each environment you work with.

Factor will auto load a `.env` file in the root of your application.

```bash
# .env
POSTGRES_URL="http://user:password@my-db-hosting-url.com:5432/db"
FACTOR_TOKEN_SECRET="example"
```

These will be parsed and made available as process vars.
