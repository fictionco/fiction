# App File Structure

## Overview

Factor apps follow simple conventions and their structure is easily customizeable to meet your needs. This doc will discuss the basic structure along with the purpose and proper use of the different files you'll encounter.

> Fallbacks: Note that some files have fallbacks that will be used if they aren't found in your app. These include: 404.vue, content.vue, icon.png, index.html.

## Control Files

The following files are used to control the handling of your Factor app.

### package.json

The entry point for any Factor app, plugin or theme is its `package.json` file. This is because Factor handles everything like a standard module, which is handled based on information in this file.

Inside package.json, factor apps need a `factor` key that supports the following options depending on what you're trying to build:

```js
// package.json
{
  "factor": {
    // unique reference ID for the module: Factor.$docsApp
    "id": "docsApp",

    // files to load based on app vs server environment
    "target": [
      "app",  // loads index.js in app
      "server" // loads index.js on server
    ]
    // or
    "target": {
      "app": "index",  // loads index.js in app
      "server": "server" // loads server.js on server
    }

    "extend": "theme" // "theme" "app" or defaults to "plugin"

    "priority": 100 // The load order priority
  }
}
```

### index.js

Index.js is the main entry file for your app, plugin and theme Factor modules. These are what is processed when the package is included. What this means is that its generally the best place to add customizations via filters or add any custom code your app will need. This file is also ideal for adding routes or advanced functionality.

Factor entry files follow a special "closure" design pattern that looks like this:

```js
export default Factor => {
  return new (class {
    constructor() {
      // do something
    }
  })()
}
```

And once loaded your exported class is accessible via `Factor.$appId` throughout your components and elsewhere (Id is added in package.json).

### index.html

Your index.html template is the skeleton for every page on your app. It is optional, but can be used to manually add metatags or other info that may not be in the default one.

The most basic index.html must include three functions: `factor_html_attr()`, `factor_head()`, and `factor_body_class()`. These functions are what plugins use if they need to add information to your head, etc.

```html
<!-- The default index.html file -->
<!DOCTYPE html>
<html {{{ factor_html_attr() }}}>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
    />
    {{{ factor_head() }}}
  </head>

  <body {{{ factor_body_class() }}}>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

## Config Files

### factor-config.json

The `factor-config` file is used to add public config to your project. It is a writeable file used by plugins and the `factor setup` CLI command.

More information about this file can be found under the [config](./config) doc.

### .env

The `.env` file is a standard file based on the [Dotenv](https://github.com/motdotla/dotenv) module.

More information about this file can be found under the [config](./config) doc.

## Customization Files

### factor-settings.js

The `factor-settings` file is where apps, plugins, and themes add settings that can be accessed via `Factor.$settings.get('some.setting')`. It is super powerful and supports all sort of values from nav item arrays, to components, etc.

More info about this file under [customize](./customize).

### factor-styles.css

## The "static" folder

### Favicon

### Icon

## Essential Components: Site, Content, 404

## Built Folders: dist and .factor

## Other Files

### .gitignore
