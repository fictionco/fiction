=======

# Factor Ultra Theme

A modern one page [Factor](https://factor.dev/) theme for personal or portfolio exposure with unique effects and features.

Live demo: https://ultra-theme.factor.dev/

---

## Installing & Customizing Themes

### Install

To install theme just add to your [Factor](https://factor.dev/) app's project dependencies:

```bash
$ cd my-project
$ yarn add @factor/theme-ultra
```

## How to use the Ultra theme

1. Go to `@apps/docs/package.json` in `dependencies` replace the default @theme for `"@factor/theme-ultra": "1.0.0-alpha.7"`
2. Go to `@apps/docs/.factor/loader-app.js` and add this line `files["ultra"] = require("@factor/theme-ultra").default`
3. Go to `@apps/docs/.factor/loader-server.js` and add this line `files["ultra"] = require("@factor/theme-ultra").default`
4. Go to `@apps/docs/.factor/loader-settings.js` and replace the default theme for the ultra theme if for example the default theme is `files["docs"] = require("@factor/theme-docs/src/factor-settings.js").default` remove that line of code and add this one `files["ultra"] = require("@factor/theme-ultra/src/factor-settings.js").default`
5. Finally run in your terminal `yarn workspace @apps/docs factor dev` and open the `http://localhost:3000/` in the browser.

Note: All the values are dynamic, you can change any value in the `@factor/@themes/theme-ultra/src/factor-settings.js` file.

### Customize

This theme uses Factor's native theme settings system.

Copy the [factor-settings.js](https://github.com/fiction-com/factor/blob/master/%40factor/%40themes/theme-ultra/src/factor-settings.js) file and place in your applications source folder `src`.

Edit the settings you'd like to change, the result will be merged with the theme settings file.

## Documentation

- [Factor Themes Guide](https://factor.dev/guide/themes)
