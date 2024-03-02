---
title: Main Files
description: Main files are the controller files for your Factor app. Learn how to load and use them.
---

# Main Files

Main files are the controller files for Factor apps and extensions. Use main files to coordinate and add functionality such as routes, callbacks, event handling, etc.

## What Are Main Files For?

You can think of main files as the entry point of your application (or extension). When your app loads, you'll sometimes want to add routes, or run functions to coordinate other activity in your app. Some examples of what you might do:

- Use `onEvent` to trigger an action when an event occurs
- Use `addRoutes` to add several custom routes to an app
- Use `addCallback` to run a function at some point Factor's lifecycle
- Run code directly when your app first loads
- Import and run functions provided by Factor plugins or themes

## Loading Your Main Files

Main files are auto-loaded based on the configuration you set in your app's `package.json`.

### App vs Server Loading

There are two different environments where loading occurs Factor's "app" environment and its "server" environment.

- The **server environment** is what runs your CLI, your express server, endpoints and so on,
- The **application environment** is the built and bundled application that gets served.

It becomes important to differentiate between the two because while both environments run JavaScript, there are many differences in terms of what "can work" in each.

For example, MongoDB/Mongoose require Node so they can only run in the server environment. While many UI libraries can only run in the client application environment (as they reference `document`).

That's why `load` provides for distinct loading of main files based on app vs server environment.

### Primary Main File

The primary main file for your app is listed under the `main` property in `package.json`. If this is unset it defaults to `index`.

To auto load the primary main file in a Factor app, you use the `factor` > `load` property. Setting it to an array of the environments it should load in:

```json
// package.json
{
  "main": "index",
  "factor": {
    "load": ["app", "server"]
  }
}
```

The above configuration will auto load the primary main file in both the app and server environments.

This setup is the simplest and works in many cases, but in other cases you may want more nuanced loading:

### Environmentally Specific Main Files

As discussed above, in many cases you may want to break out main file loading based on environment.

If you would like to load the `index.js` file in the application environment while loading `server.js` in the server, you can use the following:

```json
// package.json
{
  "factor": {
    "load": {
      "app": "index",
      "server": "server"
    }
  }
}
```

If you want to load `index.js` in both the app and server, but only load `server.js` in the server environment then you can do this:

```json
// package.json
{
  "factor": {
    "load": {
      "app": "index",
      "server": ["index", "server"]
    }
  }
}
```

From there you can extrapolate to loading any number of main files based on environments:

```json
// package.json
{
  "factor": {
    "load": {
      "app": ["index", "controller"], // loads index.js and controller.js in app
      "server": ["example", "server"] // loads example.js and server.js in server
    }
  }
}
```
