# Customizing Extensions

## Styling with `factor-styles`

Factor includes an optional style system that can be used for your global application styles. It works by gathering all `factor-styles` files in your app, themes and plugins and combining them in a specific order so that the app has the highest priority followed by themes then plugins.

> Note: **factor-styles** supports `.css`, `.less` or `.scss` files.

### `.factor-app` and `.factor-dashboard`

The **factor-styles** CSS is included in both your dashboard and your front-end app, So to make sure your customizations only apply to your app, you need to wrap all styles and variables (discussed below) in a `.factor-app` class.

It is also possible to customize the dashboard this way via `.factor-dashboard` although heavy admin style customization is discourages since the dashboard is subject to change through updates and plugins.

```css
.factor-app {
  /* my app style */
}
```

### CSS Variables

Standard CSS variables are used by plugins and themes to allow you an easy way of tweaking common style. For example, your site's primary and secondary colors, text color, background, etc.

While theme and plugin author's may add (and hopefully document) additional variables, Factor recommends some basic conventions. The standard variables are:

```css
.factor-app {
  /* Primary Brand Colors */
  --color-primary: #0496ff;
  --color-secondary: #ff0076;
  --color-tertiary: #eff6ff;

  /* Site Text and Background */
  --color-text: #506677;
  --color-placeholder: #bdcad4;
  --color-bg: #ffffff;
  --color-bg-contrast: #f7f9fb;
  --font-weight-bold: 800;
  --font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Helvetica Neue", Arial, sans-serif;

  /* States */
  --color-success: #42b983;
  --color-info: #62bdff;
  --color-warning: #ff6464;
  --color-danger: #ff0076;

  /* Borders and Shadows */
  --color-border: rgba(0, 43, 93, 0.2);
  --box-shadow-panel: 0 0 1px rgba(58, 55, 148, 0.25), 0 6px 14px 0 rgba(24, 32, 41, 0.06),
    0 12px 34px 0 rgba(24, 32, 41, 0.04);
  --box-shadow-input: 0 0 0 1px rgba(0, 43, 93, 0.2);
}
```

_Note that the values given above are just there as an example._

To change these values in your app add the above to your `factor-settings` file. Remember that individual extensions may add their own variables which are just as easy to customize, you'll just need to consult their documentation.

## Config with `factor-settings.js`

"Factor settings" is a customization system built for customizing Factor extensions and Factor itself. It works by gathering all `factor-settings.js` files in your app and extensions, then merging them together in order of priority. With your app having the highest priority by default.

This final merged "settings" config is then used in your app.

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

## Overriding

Another common way of customizing core and extension functionality is by overriding files and components.

### Override Extension Templates

#### Settings Component Override

The recommend and most common way to override templates is using `factor-settings`. To do so, the extension author must include the component via the extension's `factor-settings` file. Then all you need to do as the end-developer is include your overriding component in the settings file under the same location.

```js
// plugin factor-settings
export default Factor => {
  myComponent: () => import('./some-plugin-component.vue')
}

// your app factor-settings
export default Factor => {
  myComponent: () => import('./my-override-component.vue')
}
```

#### Automatic Override

If a plugin or theme author includes a template using the special Factor override path symbol `#`, then that template is automatically overrideable by copy/pasting the file with the same name into your app src.

#### Core Components Fallbacks

Core files that we recommend all Factor apps include are `404.vue`, `content.vue`, and `index.html`. However these files are just auto overrides for standard fallback files. To see how overrides work with core files, you can experiment adding and removing components.
