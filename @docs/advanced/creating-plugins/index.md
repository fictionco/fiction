---
title: Creating Factor Plugins
description: Learn how to create Factor plugins.
---

# Creating Plugins

Once you've learned the basic concepts of Factor, then creating plugins is easy. Let's go through the steps to create and distribute a Factor plugin.

## Setting Up

Factor plugins are just modules that include a `package.json` with a `factor` property. You'll also typically want to use the [load property](./main-files) to auto-load the extension in the Factor system.

```js
{
  "main": "index", // primary main file
  "factor": {
    "load": ["app", "server"] // load primary main file in both app+server environments
  }
}
```

Whenever this plugin is added as a dependency in a Factor app, it will automatically load the plugin's main files as well as any `factor-settings` files. Now, you can use the [plugin API](./filters-callbacks-events) to add functionality.

In a typical plugin, server main files might be used to create endpoints or add routes with components.

## Customization and Settings

When creating plugins, you need to make them customizable by end users. This is accomplished simply with `factor-settings`. All you need to do is add your default settings value to the plugin's `factor-settings` file:

```js
export default {
  myPlugin: {
    myRoute: "/cool",
    myRouteComponent: () => import("./my-component.vue"),
  },
}
```

Now in your main file, use the setting for the route value

```js
import { addRoutes, setting } from "@factor/api"

addRoutes([
  {
    path: setting("myPlugin.myRoute"),
    component: setting("myPlugin.myRouteComponent"),
  },
])
```

Now your users can easily override these settings values with their own and customize your plugin.

## Local Development

Plugins don't typically exist on a stand-alone basis, so to develop one you'll need to create an app and add it as a dependency. This can be difficult using NPM directly, as you'll have to publish your plugin each time you make a change.

Luckily there are a couple ways to avoid that:

- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) - Yarn has the idea of workspaces, also called monorepos. These allow you to co-develop many modules at the same time in the same project.
