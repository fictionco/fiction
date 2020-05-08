---
title: Using Themes
description: Learn what Factor themes are for and how to install them
---

# Using Themes

Themes help you add a full UI and template framework to a Factor application in seconds. Learn how to install and use them.

### Purpose

Themes are opinionated UI and template frameworks built on top of the vanilla Factor core. They help you create a stylized application quickly that can then be customized easily.

## Installing Themes

All that is needed to install a Factor theme is to add it as a dependency to your project (in `package.json`).

For example, to install the [Alpha Theme](https://factor.dev/theme/alpha-factor-theme), just run:

```bash
npm add @factor/theme-alpha
```

### App and Theme Conflicts

Since themes typically add a route structure, you'll need to review their settings to make sure there aren't conflicts with your app's routes or UI.

That said, nearly everything in a theme can be customized via settings. So conflicts can usually be resolved.

### Using Multiple Themes

It's possible to use multiple themes in one app. At Fiction we use a shared theme (between [Factor](https://factor.dev) and [Fiction](https://www.fiction.com)). In this theme we put all the shared functionality, customization, and plugins.

If there is an issue with load order between the themes, you can add a priority setting in `package.json` > `factor`. The theme with the higher priority value will come later in the load order, taking precedence.

```json
{
  // package.json
  "factor": {
    "priority": 300
  }
}
```

## Customizing Themes

Every theme has different features and functionality. It's best to review the documentation and/or readme for the plugin to know what is available.

Generally, there are 3 ways to use and customize themes:

- [Settings](./settings)
- [Styles](./styles)
- [Plugin API](./plugin-api)
- Providing imports and settings you can use in the app (e.g. `import {example} from @factor/theme`)

## Tips

- A theme's `factor-settings` to know what can be easily customized with settings.
