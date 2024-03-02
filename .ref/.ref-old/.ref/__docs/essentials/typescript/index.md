---
title: TypeScript Support
description: TypeScript runs natively in Factor, but it is optional. Learn how to work with TypeScript in Factor.
---

# TypeScript Support

Factor is written in TypeScript and has zero-config, native support for it in your app.

## Should you use TypeScript?

TypeScript has been rapidly improving on a monthly basis and Microsoft (who is behind it) has shown a deep commitment to being the leader in development tooling.

There are a few main advantages of using TypeScript that actually matter day to day:

- **Less bugs.** Well written TypeScript catches many bugs for you while you are writing the code. This speeds up development because typing bugs can be some of the hardest to debug.
- **Less Technical Documentation.** TypeScript automatically detects the interface or API of most modules you might import to your project. It then clues you in to which options are available, and to which values they can be set. This has the effect of massively reducing the amount of time you'll have spend reading documentation.
- **Document as you write** If you write your code with types, it is effectively self documenting. That means you can spend less time explaining your code and more time writing it.
- **More Stable** If you write large libraries then TypeScript can reduce the amount of tests you need to write to maintain stability. It helps reduce regressions.

**Ultimately, it's about saving time and making better apps.**

The good news is that Factor takes care of everything that may be hard or confusing about getting TypeScript working. It automatically configures Node and WebPack to natively compile `.ts` files.

If you feel more comfortable not writing types, we still recommend using TypeScript files (`.ts`) instead of `.js` files. You can always just use `any` to bail out if needed.

## Using TypeScript

If you have a Factor enabled app, then `.ts` files will work immediately with no further configuration on your part. However, there are a couple more steps needed to get healthy type checking in your code editor.

## Type Checking Your Project

Here is our recommended TypeScript checking setup:

### .tsconfig

First, add a `.tsconfig` file to the root of your app. In it we highly recommend configuring TypeScript for script checking.

Currently the recommended config looks like this:

```json
// .tsconfig
{
  "compilerOptions": {
    "allowJs": true,
    "noEmit": true,
    "target": "ES2018",
    "module": "commonjs",
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "strict": true,
    "noUnusedLocals": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "skipLibCheck": true
  }
}
```

Note that this will evolve over time. In particular, in the future we will likely recommend evolving handling for modules or ES target.

### TypeScript Eslint

To help make sure your code is using best practices, we also recommend using [TypeScript Eslint](https://github.com/typescript-eslint/typescript-eslint).

To use the configuration as we do, add the following libraries to your dependencies:

**TypeScript**

- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser

In your `eslintrc.js` file you can add configuration like this:

```js
module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    // rule changes
  },
}
```
