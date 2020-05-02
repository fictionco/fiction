---
title: Using Plugins
description: Learn how to install and customize Factor plugins
---

# Using Plugins

Plugins are a powerful way to add functionality to your application in minutes. Just install as a module and customize with `factor-settings`.

## Purpose

The point of plugins is to add specific functionality. The goal is for them to "just work." which means they have intelligent defaults. Use plugins for anything from adding a blog to a sitemap. While plugins can add new UI, [themes](/using-themes) are meant to be more opinionated UI frameworks.

## Installing Plugins

All that is needed to install a Factor plugin is to add it as a dependency to your project. In other words, add it in your `package.json` file.

For example, to install the [Sitemap Plugin](https://factor.dev/plugin/sitemap-xml), just run:

```bash
npm add @factor/plugin-sitemap
```

## How Plugins Work

Plugins use the [plugin API](./filters-callbacks-events) to interact with the core Factor features and deliver an out of the box extension experience to your app.

They are loaded automatically via a loading routine dictated by the [main files](./main-files) configuration in the plugin.

## Customizing Plugins

Every plugin has different features and functionality. It's best to review the documentation and/or readme for the plugin to know what is available.

Generally, there are 3 ways to use and customize plugins:

- [Settings](./settings)
- [Styles](./styles)
- [Plugin API](./filters-callbacks-events)
- Providing imports and settings you can use in the app (e.g. `import {example} from @factor/plugin`)

> **Tip:** Reference any plugin's `factor-settings` to know what can be overwritten and configured. Here is an ([example](https://github.com/fiction-com/factor/blob/development/%40plugins/plugin-forum/factor-settings.ts)).

## Disabling plugins

Sometimes extensions may use other plugins in the Factor ecosystem that you don't want. For example, a theme might install an unneeded blog.

To disable any plugin, you can just add their package name to the `disable` property to your `package.json` under `factor`.

```json
{
  "factor": {
    "disable": ["@factor/plugin-blog"]
  }
}
```
