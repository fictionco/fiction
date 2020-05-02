---
title: Installation and Setup
description: Learn how to add Factor to your JavaScript (or TypeScript) project or scaffold a new project from scratch.
---

# Installation and Setup

Getting started with Factor is designed to be fast, easy, and simple as possible. In this guide, we'll discuss ways to get a project started with Factor, as well as best-practices for setting up a Factor enabled application.

> **Getting Started - Video Guide**
> Check out the video guide to [getting started with Factor](../install).

## Before you start

In using Factor, we assume you have basic knowledge about running standard JavaScript/Node oriented web applications. But to recap, to work effectively Factor you'll need:

- Node LTS (currently version 12+)
- Your computer terminal (shell)
- Folder with a [`package.json`file](https://docs.npmjs.com/files/package.json)
- A Git repo to store your code and manage deployments

## Generate An App

The easiest way to set up a fully-featured Factor application is to use the scaffolding tool `create-factor-app`. This tool creates a new project for you and includes recommended tooling and files.

To run this tool, just type the following in your terminal (_yes, it just works nothing else is necessary_)

```bash
npx create-factor-app <folder-name>
```

_or with Yarn:_

```bash
yarn create factor-app <folder-name>
```

Once launched, it will walk you through the next steps.

Once the utility has finished setting up your project, all you need to do from here is run your development server.

```bash
npx factor dev
```

## Starting From Scratch

Creating a Factor project from scratch is easy, only a project folder and a `package.json` file are required. Create an empty directory to start:

```bash
mkdir <project-name>
cd <project-name>
```

### Adding Core Dependency

Next just add `@factor/core` as a dependency to your project. This will install the terminal CLI and all required tooling:

```bash
npm add @factor/core
```

### Package.json

Next, you may want to add some helper scripts for common Factor commands in your `package.json`:

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "npx factor dev", // Launch and serve dev server
    "build": "npx factor build", // Builds production app
    "serve": "npx factor serve", // Serve production app
    "start": "npx factor start" // Build + serve app
  }
}
```

#### .env

Your `.env` (dotenv) file is where you'll store all your secret API keys, at least locally. Create this file:

```bash
# Authentication Decode/Encode Secret
FACTOR_AUTH_SECRET="random-secret-abc213"
```

You'll need to add additional keys to this file to enable your "key services" discussed below.

#### .gitignore

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

## Services Setup

### Auth, Db, Email, Storage

Factor is built for portability, it works consistently and simply across multiple servers. This also means the preferred way to handle 3 key services&mdash;email, database, and image storage&mdash;is from outside your app.

### Database

#### Your DB Connection

The method of giving Factor this information is via a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/). A URL-like connection format. There are many ways to setup and host a MongoDB database. Each method will have a straight forward way of getting a connection string.

Once you have a string, just add it to `.env` under `FACTOR_DB_CONNECTION`:

```bash
# .env - DB Connection (Mongo Connection String)
FACTOR_DB_CONNECTION="mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"
```

> **Recommendation**
> Mongo Atlas [Integration Tutorial](./mongo-atlas)

### Auth

Once you're database is setup, setting up your users, admins, and auth is just a couple more steps. Check out the document on [users and auth](./users-and-roles).

### Image Storage

You'll need somewhere store images uploaded through Factor. For this we recommend an external image storage service that cleanly separates your app from your images.

> **Recommendation**
> Amazon/AWS S3 [Integration Tutorial](./amazon-s3)

### SMTP Email

Every CMS oriented system needs email for things like email notifications, forgot my password emails, email verification, etc. for this Factor integrates a standard SMTP email tool that needs to be connected with an external service.

> **Recommendation**
> Mailgun [Integration Tutorial](./mailgun)

## Project Setup Tips

### Linters and Types

Now that you have Factor working, we recommend you add some additional tooling to help you down the line. We highly recommend strict linting and type checking; it will help you create stable and professional code. We recommend implementing the following:

- **Eslint (eslintrc).** Code formatting guidelines and autoformatting. It can help you catch bugs and maintain best practices. See examples for reference configurations.
  - Use [Eslint Recommended](https://eslint.org/docs/rules/)
  - [Eslint Unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- **Prettier.** Code organization and styling. Helps a lot.
  - [Github](https://github.com/prettier/prettier)
- **TypeScript (.tsconfig.json)** To get started using TypeScript all you need to add is a `.tsconfig.json` file. See examples for reference configurations.

### Code Editor / Plugins

We use [VSCode](https://code.visualstudio.com/) exclusively at Fiction, and if you use it to, we can recommend some plugins for it that we find helpful.

- [Vetur](https://github.com/vuejs/vetur) - Vue tooling for VSCode
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Avoid typos
- [Prettier](https://github.com/prettier/prettier-vscode) - Format code nicely
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Directly integrated Eslint handling
- [Gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Advanced Git history tool
- [Dotenv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - Syntax support

## Next Steps

Now that you have your project setup, it's time to learn the essentials of Factor app development. Typically that starts with [main files](./main-files).
