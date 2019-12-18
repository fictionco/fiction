# Plugins and Themes

## Installation

Factor is designed to be used with plugins and themes.

- **Plugins** - Add any sort of functionality.
- **Themes** - Are essentially pre-made apps that can include UI libraries, templates, etc..

![Adding Extensions](./img/adding-extensions.svg)

### yarn install [extension]

Installing and activating a plugin or theme happens in a single step: `yarn install [the-extension]`. Once added to your project dependencies, Factor detects them and loads them accordingly.

```bash
yarn install [extension]
```

## Customize Plugins

In most cases, you'll want to customize plugins and themes to suit your use case.

While each extension has it's own approach to customization, extensions are typically designed to be customized via 3 methods:

- `factor-settings`,
- `filters` and
- CSS variables.

To learn more about how to use these in Factor, check out the guide on [settings and style &rarr;](./settings-and-style)

> Always read the `README` associated with the plugin or theme, typically they will have some guidelines around how they should be customized. However, if this is insufficient, you can always look inside the extension at the `factor-settings.js` file. Anything in this file can be edited by the settings file in your app.

## Creating and Themes

[Creating Factor Plugins &rarr;](./creating-plugins)

[Creating Factor Themes &rarr;](./creating-themes)
