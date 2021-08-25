---
title: Factor App Configuration
description: The basic configuration information needed in a Factor app
---

To coordinate Factor across your development and production environments it is important to set up a few configuration settings.

## Factor Config File

Your Factor app requires a `factor.config.ts` file in its root. This file just needs to export a default object with your Factor build (or server) settings.

The only required items for this file are your basic application variables for name, url, email, and domain. This will help Factor add functionality and ensure everything stays properly named. Setting them looks like this:

```typescript
// FILE: factor.config.ts
export default {
  variables: {
    FACTOR_APP_NAME: "FactorES",
    FACTOR_APP_EMAIL: "hi@factor.so",
    FACTOR_APP_URL: "https://www.factor.so",
    FACTOR_APP_DOMAIN: "factor.so",
  },
}
```

> Anything added to the `variables` property in `factor.config.ts` will be available across your application as an environmental variable.

## Runtime Application Config

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

## Endpoint Server Config

The entry point for your app's endpoint server is a `server.ts` in your source folder. As with your app entry file, this file should export a function named `setup` which should return configuration for your endpoint server.

The primary items you'll need to export here are server/endpoint `plugins`, url `sitemaps`, and custom `endpoints`.

```ts
// FILE: src/server.ts
import { doServerStuff } from "./server-do-stuff" // other custom code

export const setup = (): UserConfigServer => {
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

## Dotenv (.env) and Private Environmental Variables

For many secure transactions, like working with a database, you'll need to use private environmental variables. These are where you'll store sensitive data like private keys and passwords.

Most services, like Heroku or Netlify, have a standardized way of adding environmental variables in production. In other environments, e.g. development, you'll need to set these up using `.env` files based on the [Dotenv standard](https://github.com/motdotla/dotenv#readme).

> **Note:** You should never commit `.env` files to source control (git). They are meant to be set up manually for each environment you work with.

Factor will auto load a `.env` file in the root of your application.

```bash
# .env
POSTGRES_URL="http://user:password@my-db-hosting-url.com:5432/db"
FACTOR_TOKEN_SECRET="example"
```

These will be parsed and made available as process vars.
