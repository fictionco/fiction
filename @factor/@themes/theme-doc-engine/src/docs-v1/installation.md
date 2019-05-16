# Installation

## Famous 5-Minute Install

Starting a new Factor app should be easy. The goal is to have you up-and-running in **less than 5-minutes**. 

A simple project only needs the `@factor/cms` dependency. Which installs Factor CLI as well as some packages. Let's dig in...

> **Node + Yarn - Global Dependencies** <br/>
> Factor requires [Node.js](https://nodejs.org/en/) version 10 or above, as well as [Yarn](https://yarnpkg.com/en/) for dependency management.

## [Using `create-factor-app`](#create-factor-app)

To get started quickly, we've built a scaffolding tool: [create-factor-app](https://www.npmjs.com/package/create-factor-app).

> Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since NPM `5.2.0`)

```bash
$ npx create-factor-app <project-name>
```

or with Yarn: 

```bash
$ yarn create factor-app <project-name>
```

Running this command will install some dependencies and start a CLI designed to guide you through the process of creating an app. 

It will ask you a couple questions and then it will install and create a basic Factor app. 

Once it's finished, the next step is to navigate to the project folder and launch it with:

```bash
$ cd <project-name>
$ yarn factor dev
```

With this, your starter application should be running at **http://localhost:7777**.

## [Starting from scratch](#starting-from-scratch)

Starting a Factor application from scratch is also really easy, it only needs *1 file and 1 directory*. Let's create an empty directory to start working on the application:

```bash
$ mkdir <my-app-name>
$ cd <my-app-name>
```

Add a `package.json` file, which at at minimum should contain the following: 
```json
{
  "name": "my-app-name", 
  "version": "1.0.0", 
  "homepage": "https://www.your-app-url.com", 
  "main": "src/plugin.js", 
  "license": "...",
}
```

### [Installing `@factor/cms`](#installing-factor)

Once the `package.json` has been created, add Factor CMS to the project via yarn:

```bash
$ yarn add @factor/cms
```


### First Component

#### [File and Directory Structure](#structure)

The basic file and directory for typical Factor apps and themes looks like this: 

```yaml

# Config
--: package.json
--: factor-config.json (optional for now)
--: factor-secrets.json (optional for now)

# App Source
--/src: 
  --: plugin.js (app entry file)
  --: index.html (HTML template wrapper for all pages)
  --: content.vue (component wrapper for all views)
  --: fallback.vue  (404 error)
  --: ...(additional components and folders)...
--/static:
  --: static assets (favicon, manifest)

# Other 
--: .gitignore (make sure to ignore factor-secrets.json)
```

Assuming you've created your package.json and installed @factor/cms. The next step is to create a `src` folder and add the following files: 
- `index.html` - Add your standard HTML 


```html
<template>
  <h1>Hello World!</h1>
</template>
```
