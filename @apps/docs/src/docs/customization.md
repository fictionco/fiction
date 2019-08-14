# Customizing Extensions

## Styles with `factor-styles.css`

### CSS Variables

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
