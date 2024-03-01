---
title: Creating Factor Plugins
description: Learn how to create Factor plugins.
---

# Creating Plugins

Once you've learned the basic concepts of Factor, then creating plugins is easy. Let's go through the steps to create and distribute a Factor plugin.

## Setting Up

### Naming Your Plugin

Theoretically you can choose any name for your plugin. However, if you'd like Factor to "transpile" your plugin at runtime, then it is required to have `factor` somewhere in the module name.

> **Technical Note:** This is required because at transpile time, `ts-node` uses a `ignore` flag that references the names of modules. So if you don't use `factor` in the module name, it will be ignored by default.

## Local Development

Plugins don't typically exist on a stand-alone basis, so to develop one you'll need to create an app and add it as a dependency. This can be difficult using NPM directly, as you'll have to publish your plugin each time you make a change.

Luckily there are a couple ways to avoid that:

### Yarn Workspaces

Yarn has the idea of [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), also called monorepos. These allow you to co-develop many modules at the same time in the same project.

Due to complications with other approaches (e.g. `link`), we recommend you use workspaces for Factor extension development.

To help you get setup, we've created a simple [Factor with workspaces example repository](https://github.com/fiction-com/factor-example-workspace-development).

### Local Dependency + Link

Generally we don't recommend using link and local dependencies, because they are famously bad at handling edge cases. However, here is an [example repo](https://github.com/fiction-com/factor-example-local-dependency) that employs link along with a local dependency.

## Main Files

Factor plugins are just modules that include a `package.json` with a `factor` property.

You'll also want to use the [load property](./main-files) to auto-load the extension in the Factor system.

```js
{
  "name": "my-factor-plugin",
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
// factor-settings
export default {
  myPlugin: {
    myRoute: "/cool",
    myRouteComponent: () => import("./my-component.vue"),
  },
}
```

Now in your main file, use the setting for the route value

```js
// index.ts
import { addRoutes, setting } from "@factor/api"

addRoutes([
  {
    path: setting("myPlugin.myRoute"),
    component: setting("myPlugin.myRouteComponent"),
  },
])
```

Now your users can easily override these settings values with their own and customize your plugin.

## Publishing Plugins

Once you have your plugin working, that last thing you'll need to do is "publish" it on NPM.

This will give users the ability to add it as a dependency and thus use it.

If you're using the workspaces approach mentioned above, we recommend using [Lerna](https://github.com/lerna/lerna) to help with publication.

## Listing on Factor

Finally, if you'd like to list your plugin on Factor you only need to do two things:

- Make sure you follow the [Extension Guidelines and Standards](./extension-guidelines)
- Write an email to [factor@fiction.com](mailto:factor@fiction.com) including the name of your plugin and link to the plugin repo.
