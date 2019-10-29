# Themes

_Themes help give you a big headstart when creating new apps. And luckily, Factor was developed from the start to make the most the concept. In this document, we'll discuss how Factor themes work and how to work with them._

## Using Factor Themes

### Installing A Theme

To install a Factor theme just it as a dependency in your `package.json`. This will tell Factor to install it and how to use it.

For example, to install the theme that this site is running, just run:

```bash
$ yarn add @factor/theme-docs
```

Once installed as a dependency, Factor will load the theme. The theme itself determines how it should run, so reference the theme's documentation for additional information on its usage.

### Forking: Theme as an App

Both Factor themes and apps (the directory you work in) are designed to follow the same structure and conventions. So if you'd simply like to use a theme as the _starting point_ for an application, simply download the theme and start working inside the theme folder.

> **Note** that with the "forking" approach, you won't be able to directly update the theme; although it is always possible to merge updates in.

## Customizing Themes

Factor gives you many tools to fully customize themes.

### Style and CSS Variables

Factor theme creators typically use standard CSS variables to provide users a way to customize commonly customized UI elements. For example: the primary colors, shadow styles, fonts and so on...

While customization approach is left up to theme creators, the usual approach to customize style is to override the theme's `style-vars.css` file.

To do this, simply place a new `style-vars.css` variable in the root of your app. Note that this will completely replace the one used by your theme, so make sure to include all the same vars.

Also it's important to understand [how CSS variable scope works](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). Factor uses different UI namespaces to your app to help keep the front-end of your app from interfering with plugins such as the dashboard.

As a result, all front-end customization variables should be added under the `factor-app` namespace.

```css
/* 
  Add to factor-app namespace
  /my-app/style-vars.css 
*/
.factor-app {
  --color-primary: red;
}
```

### Settings.js

To customize a theme's settings all you need to do is add a `settings.js` file to the root of your app.

The specifics of what settings are available differ from theme to theme. So often a good starting point is simply to copy/paste the theme's settings.js and customize it directly.

The theme's settings.js will ultimately be merged with the app's, so it's not necessary to have a value for every theme setting in your app.

```javascript
// in theme/settings.js
export default {
  homePageHeadline: "Hello World!",
}

// in app/settings.js
export default {
  homePageHeadline: "Howdy!",
}

// The homepage will use say "Howdy!"
```

### Overriding

If the standard customization settings or variables aren't enough, most themes make it possible to override their templates. To do so, all you need is to add a file with the same name to the root of your app and it should be used instead of the theme equivalent.

## Creating A Theme

If you're familiar with the process of creating a Factor app, then you know how to create a Factor theme.

As discussed above, a theme just needs a couple considerations:

- Style variables consolidated to `style-vars.css`
- Using `$setting()` and `settings.js`
- Package.json changes
- Theme documentation
- Screenshots

### Style Vars

To make theme customization easy for users, we recommend using CSS variables for all branding or customizeable elements of your templates and components. Simply add all your variables into an overrideable file called `style-vars.css` and make sure they are all scoped to the `factor-app` namespace.

### Settings.js

Factor uses a simple `settings.js` and `setting('some.setting')` system to make theme customization lightning fast.

All you need to do is place a `settings.js` file in your theme root. In this file place an exported JS object that includes all the settings you need throughout your theme.

Then Factor will automatically import and merge this file with your user's app settings.js.

Inside your theme, just request your settings like this:

```javascript
// settings.js
export default {
  setting: "duck",
  group: {
    setting: "goose"
  }
}

// inside a component:
const myValue = setting("setting") // duck
const myNestedValue = setting("group.goose") // goose

// elsewhere
const myValue = setting("setting") // duck
const myNestedValue = setting("group.goose") // goose
```

#### Components in Settings.js

It is often important to make components in your theme easily customizeable. For example, the primary app logo.

To allow for this, just use dynamic imports directly in your settings.js

```javascript
// theme/settings.js
export default {
  logo: () => import('./theme-logo.vue')
}

// app/settings.js
export default {
  logo: () => import('./app-logo.vue')
}
```

Then use a dynamic Vue component to load this component in your templates:

```html
<component :is="setting(`logo`)" />
```

## Package.json

To designate your theme as such for Factor, all you have to do is add `extend: "theme"` to your package.json, under the `factor` property. As follows:

```json
{
  "factor": {
    "extend": "theme"
  }
}
```

## Theme Documentation

Factor gives theme creators a ton of flexibility to determine exactly how a theme will work, as well the level and scope of their customizeability. For that reason, good theme documentation is essential.

### What To Cover

- What settings are available and what they do
- What style variables are available and what they do
- Any files designed to be overrided and how best to do so

### Where to document

Depending on how complicated your theme is, you may just get away with placing documentation in your theme's README.md file. This is a simple and expected way of documentation. If you would like to do more, we recommend creating a documentation site similar to the one you're reading now.

## Listing Your Theme

Factor allows your to list your theme so that users can find it. However, before it can be approved we have some simple guidelines...

### Screenshots

Add a primary screenshot sized at **1500px by 1000px** called **screenshot.jpg** and place it in the root of your theme. Other screenshots are allowed and are used in galleries for your app. Additional screenshots should start with `screenshot-` and will be sorted alphanumerically.

### GPL-2 License

Factor is an open-source GPL-2 licensed platform. In order to keep the community open, we require all Factor themes be licensed GPL-2 as well.

### Quality and Review

Finally, all listed Factor themes must meet subjective guidelines for quality and usefulness. They should be professional and complete in their submitted form.

Other guidelines:

- May not include provider backlink SEO or intrusive marketing
- Must be fully working
- Must be adequately documented
