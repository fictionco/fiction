---
title: Manually adding Factor to a project
description: Learn how to add Factor to a project manually
---

# Manually Installing Factor

Creating a Factor project from scratch is easy, only a project folder and a `package.json` file are required. Create an empty directory to start:

```bash
mkdir <project-name>
cd <project-name>
```

## Adding Core Dependency

Next just add `@factor/core` as a dependency to your project. This will install the terminal CLI and all required tooling:

```bash
npm add @factor/core
```

## Add Main File

Next just add a [main file](./main-files) in your project. Typically this is called `index.ts`. This is where you will add custom code.

## Run Setup Routine

Now that you've added Factor as a dependency. Run Factor from the command line and it should run the setup routine.

```bash
npx factor dev
```

> **Note:** Factor's setup routine only runs if there is no `factor` property in your `package.json`.

## Package.json

Once you've run setup, your`package.json` will look something like this:

```json
{
  "name": "my-app",
  "factor": {
    "load": {
      "app": "index",
      "server": "index"
    },
    "app": {
      "name": "Example",
      "url": "https://example.com",
      "description": "My app",
      "email": "Example <hi@example.com>"
    },
    "admins": ["you@example.com"]
  },
  "dependencies": {
    "@factor/core": "^1.0.0"
  }
}
```

## Add A Theme

Now you'll have a blank app that is ready for some custom code. If you want a head start, then that's what [themes](./using-themes) are for.

To add a theme, just add it as a dependency:

```bash
npm add @factor/theme-alpha
```

## Other Files

### Environmental Variables with .env

Your `.env` (dotenv) file is where you'll store all your secret API keys, at least locally. Create this file:

```bash
# Authentication Decode/Encode Secret
FACTOR_AUTH_SECRET="random-secret-abc213"
```

You'll need to add additional keys to this file to enable your "key services" discussed below.

### Ignore Files in Git with .gitignore

Assuming you're using Git to manage your source code, another crucially important file to add to your project is `.gitignore`. You'll need to make sure you don't commit a few Factor/Node files to source:

```bash
# factor
**/dist
**/.factor

# node
node_modules
**/node_modules

# secrets (Important!)
.env
**/**.env
report*
*.log
```
