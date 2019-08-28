# Creating Plugins

## Overview

A Factor plugin is a standard node module that has a few tweaks to make it work elegantly with Factor core. The goal with Factor plugins is to make them "drop-in" which means the following:

- No code needed for basic use
- Intelligent, sensible defaults
- Minimal configuration
- Easily added and deleted

Luckily, Factor makes all this easy to do using [\$filters](/guide/filters) along with the core extensions system.

> Note: The easiest way to start a plugin is copy and edit an [existing plugin](https://github.com/fiction-com/factor/tree/master/%40factor/%40plugins)

## Defining a Plugin

To start a plugin, create a folder in your local development directory that includes a standard `package.json` file. This single step defines a NPM module, which is the basis for your plugin.

In your `package.json`, add a `factor` property. This is where we'll add Factor specific configuration info and tells Factor it's a plugin.

An example `factor` property looks like this:

```json
// package.json
{
  "name": "my-factor-plugin",
  "factor": {
    "id": "someId", // Adds main file to Factor as Factor.$someId

    "target": ["app"], // Loads in app env.
    // or
    "target": ["app", "server"], // loads index.js in app & server env.
    // or
    "target": {
      "app": "index", // Loads index.js in app env and server.js in server env
      "server": "server"
    },
    // or advanced
    "target": {
      "app": ["index", "secondFile"], // Advanced case, full control of several files and where they load
      "server": ["server", "index", "somethingElse"]
    },

    "extend": "theme", // or "plugin" ... defaults to "plugin"

    "priority": 100 // Load priority ... defaults to 100. (Lower number is earlier load)
  }
}
```

### Setting Up Development

To setup development of a plugin, you'll need to create a basic "example" app that can be used as the place you'll run the `factor dev` cli command. Here you'll reference your plugin by adding it as a dependency. There are two ways to do this elegantly:

- Monorepo: Use [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and a monorepo to make locally referencing packages a breeze. (We use this approach for Factor and [Factor Extend](https://github.com/fiction-com/factor-extend).)
- `file:` prefix: it's possible to locally reference modules using the NPM `file:` prefix [discussed here](https://docs.npmjs.com/files/package.json#local-paths).

Once you've successfully setup your development environment, you should start your "example" app using `yarn factor dev`. Then you should be able to work on your plugin and see how changes affect your app in real-time.

## Loading Extensions

### Main Files

A main file is a convention in JS modules that tells the system what file should be loaded when a module is imported into a script. In Factor, the default is `index.js` but the **target** attribute gives you fine control over what is loaded and where (discussed below).

#### Class Pattern

Inside Factor main files, Factor recommends you use a standard class "closure" pattern that makes it easy to access the `Factor` global and also work with your plugin throughout the Factor system. The pattern looks like this:

```js
// index.js or server.js (main file)
export default Factor => {
  return new (class {
    constructor() {
      // Initialize
    }
  })()
}
```

### Loading in Server vs App Environment

Factor has two key environments: _"app"_ and _"server"_.

- **APP** - The app environment consists of a standard Webpack driven VueJS application. This is compiled during build into an optimized "bundle" and is where all your components, routes, CSS, etc live.

- **SERVER** - The server environment consists of the CLI and endpoint environments. Endpoints are where trusted actions like API calls (that require private keys) take place, while the CLI is where your application is built and served.

#### The Problem

##### Webpack analysis vs Node process

Both these environments run Javascript and Factor goes to lots of effort to make both of these environments work together nicely. However, there are some realities of the underlying software you'll need to be aware of to work effectively (_and avoid painful bugs!_). These are:

- **Webpack Static Analysis** - Webpack does static analysis of all files it sees in its compile path. This means that code that isn't ever technically run in the app environment still gets included in the build. Some NodeJS code is simply not compatible with the browser environment and will throw mysterious errors in your terminal.

- **Node "Long-Running" Process** - Your Node process should be considered "long running" meaning info that is stored in memory will last a long time, as opposed to in the browser where everything starts from scratch with every page load. For that reason, server code sometimes needs to be written to accomodate this and avoid "[stateful singletons](https://ssr.vuejs.org/guide/structure.html#avoid-stateful-singletons)."

While it's often ok to load the same code into both environments, these differences can sometime make it important to separate code into app vs server files. That's why Factor introduces the "target" attribute discussed below.

#### The Solution

##### The "Target" Attribute

Configuring the `target` attribute in package.json tells Factor how it should load main files for an extension. There are two environments: "app" and "server" and they can be set to load the default `index.js`, a different file for each environment, or many files based on environment.

```js
// package.json
"main": "index.js",
"factor": {
  "target": ["app"] // load index.js only in app environment
  "target": ["app", "server"] // load index.js in both server and app
  "target": {"app": "index", "server": "server"} // load index.js in app, server.js on server
}

```

## Working with Your Plugin

Once you have your plugin loading, you're ready to start working on your plugin. Plugins add or alter functionality to a Factor app in these primary ways:

### Filters and Events

[Filters](./filters) provide a standard and versatile way to modify data and functionality of functions elsewhere in Factor. Typically all you need to do is place your filters in the plugins main file and use these to add the functionality you need.

Also, Factor has a special `Factor.$events` utility that makes it easy to emit or listen for events using the following:

```js
Factor.$events.$on("some-event", eventParams => console.log(eventParams)) // listen
Factor.$events.$emit("some-event", eventParams) // emit
```

#### Example: Routes, Components, Events

```js
// index.js
export default Factor => {
  return new (class {
    constructor() {
      this.addRoutes()
      this.addComponents()
      this.events()
    }

    addRoutes() {
      // Takes an array []
      Factor.$filters.add("content-routes", routes => {
        return [
          ...routes,
          {
            path: "/my-route",
            component: () => import("./component-for-my-route")
          }
        ]
      })
    }

    addComponents() {
      // Takes an Object {}
      Factor.$filters.add("components", components => {
        return { ...components, "my-component-name": () => import("./my-component.vue") }
      })
    }

    // listen for events
    events() {
      Factor.$events.$on("some-event", params => {
        console.log("params")
      })
    }

    // emit events
    notify(message) {
      Factor.$events.$emit("notify", message)
    }
  })()
}
```

### Plugin Global Reference

All Factor extensions add a reference to the global `Factor` variable so that they can be referenced elsewhere directly if needed.

The "id" property you set in your `package.json` determines the name of the reference. For example, if your id is `myEmailExtension` then once it's loaded it will be available by reference as `Factor.$myEmailExtension` everywhere else in your app.

```js
// package.json
"factor": {
    "id": "myEmailPlugin",
    "target": "app"
}

// Inside a component
async myComponentMethod(){
  await Factor.$myEmailPlugin.sendEmail() // send an email or something
}
```

#### Handling Multiple References

Handling multiple references per plugin is easy. If the main file is named something other than `index.js` then the name of the file will be appended to the ID with the first letter capitalized. If loading `server.js` then that class is reference as `Factor.$myIdServer`.

### Settings and Styles

Plugins are also fully compatible with Factor's native `factor-settings` and `factor-styles` systems. Read more about them in the [customization doc](./customize).
