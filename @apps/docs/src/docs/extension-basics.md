# Extending Factor

## Overview

Factor is an "extension-first" framework. Meaning it is itself a simple core system with first class support for extensibility by plugins and themes. Almost anything in Factor can be customized given the right plugin.

#### Extension Types:

- **Plugins** &rarr; _New features and functionality_<br>
  The scope of Factor plugins is to deliver new features or functionality to Factor. For example, adding an SEO utility or bug-tracking middleware.

- **Themes** &rarr; _An opinionated starting point for your app_<br>
  Themes give you a design framework and include UI for commonly used items like notifications or buttons. The sky is the limit as far as what themes can do.

## Adding Extensions

Factor is designed for "drop-in" extension. To be "up and running" with new plugins and themes, all you do is run `yarn add my-extension`...

```bash
$ yarn add some-factor-plugin
```

When you run Factor, it detects your extensions and loads them for you. Extensions will then use Factor's filter and settings system to install and configure themselves.

## Customize: `factor-settings.js`

"Factor settings" is a customization system built for customizing Factor extensions and Factor itself. It works by gathering all `factor-settings.js` files in your app and extensions, then merging them together in order of priority. With your app having the highest priority by default.

This final merged "settings" config is then used in your app. Settings are referenced in templates using `$setting.get('some.setting')`. Note that dot notation is a key aspect when referencing values (discussed below).

Using this system its possible to fully customize your extensions depending on the specifics of the extension. (Since each extension is different we recommend consulting their documentation for exact details).

Example:

```js
// PLUGIN/THEME: example-plugin/factor-settings.js
export default Factor => {
  return {
    myCar: {
      type: "mercedes",
      color: "black",
    },
    myHouse: () => import("./house-component.vue")
  }
}

// APP: your-app/src/factor-settings.js
export default Factor => {
  return {
    myCar: {
      color: "black",
    },
    myHouse: () => import("./custom-house-component.vue")
  }
}
```

In the above example, a `factor-settings` file in your application would override the `myHouse` component and the `myCar.color`. The final values could be referenced in your Vue templates as follows:

```html
<template>
  <div>{{ $setting.get("myCar.color") }}</div>
</template>
```

## Working With Themes

You have the option of using themes in one of two primary ways:

- Starting Point: Use a theme as your app and customize its files directly. Thie approach sacrifices the ability to upgrade the theme for more ability to customize things.
- Dependency: If you use the theme as a dependency, you can easily upgrade it as new features are added.
