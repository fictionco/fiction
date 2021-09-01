---
title: Developing a Factor Theme
description: Learn how to develop, use and distribute a Factor theme
---

# Developing a Factor Theme

In a technical sense, Factor themes are just Factor apps that are made editable using settings. Themes have an important role though, they allow you to add a complete UX/UI framework to a Factor app in seconds.

Many people use themes in the following scenarios:

- **Creating a proprietary "secret sauce" when developing for themselves or clients** You might develop a Factor "theme framework" for yourself or clients and then use it over and over again on different sites and apps. This will allow you to do amazing work in very little time.
- **Build and sell themes.** You can build and sell themes with additional functionality to clients. This is also a popular way to make money in the WordPress ecosystem.
- **Share functionality between apps.** You can use a single theme with multiple apps to share functionality across them without having to code things twice.

In this guide, we'll walk through how to set up a theme.

## Creating a Theme

If you know how to create a Factor app, then you know how to create a theme. They are essentially the same thing.

To turn a standard Factor application into a theme, you only need to do the following:

- **Set to Theme in Package.json.**
  In `package.json` set `factor.extend` to "theme". This helps Factor distinguish themes from plugins and establish correct loading order. Things will still work without it however.

```json
// package.json
{
  "factor": {
    "extend": "theme"
  }
}
```

- **Add As Dependency**
  To use a theme, you must be able to add it as a dependency in your `package.json`. When developing this can be trickier than you'd think! NPM only works well with published packages and you don't want to publish each time you make a change.

  The easiest way around this is to use a [monorepo](./development-monorepo) otherwise you'll have to use a [local dependency / link approach](https://github.com/fiction-com/factor-example-local-dependency) (_not recommended_) or just publish each change as a [NPM module](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages).

- **Add Settings**
  Once your theme is added as a dependency you'll need to be able to customize it from the base application. Since themes load before the base app, overriding and customization is easily accomplished via [settings](./settings).

- **Add Metainfo, Screenshots, Documentation**
  To distribute your theme, you'll need to add additional metadata as well as screenshots and documentation. This is discussed in the [theme guidelines doc](./extension-guidelines)

## Theme Structure Guidelines

While creating themes is technically simple, how you use them is where you'll gain a productivity advantage.

A typical use case is to add popular UX frameworks or component libraries into a Factor theme. Some example themes that would be trivial to implement by just adding the associated libraries:

- Bootstrap Factor Theme
- Vuetify Factor Theme
- Materialize Factor Theme
- Tailwind Factor Theme

And the list goes on.

To create a framework for a component or UI library you might need to do the following:

1. Add a [Custom Webpack loader](./extending-webpack)
1. Add [custom styles or CSS](./styles)
1. Add components that can then be imported from your base app
1. Add [settings](./settings) that can be used in the base app
