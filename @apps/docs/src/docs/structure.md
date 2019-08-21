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
  // This sets your source folder to 'src', default is simply index.js
  "main": "src/index.js",
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

## Source vs Root Folder

In a Factor app, the source or `src` folder is determined by the folder containing your primary `main` file of your app. If, for example, your app package.json sets main to `src/index.js` then the folder `src` will be treated as your app source.

Here is how you should think of the two key folders of your app:

- **Source** - (`/src`) - This is your application source code. It should include all components, images, static files, templates, etc..
- **Root** - (`/`) - The root of your app should be used for configuration (factor-config, .env, package.json), build and test code, etc..

### The Main File: index.js

Index.js is the main entry file for Factor apps and modules. The main file is generally the best place to add customizations via filters, custom routes and any other custom code your app will need.

#### Closure Class Convention

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

### Template: index.html

Your index.html template is the skeleton for every page on your app. It is optional, but can be used to manually add metatags or other info that may not be in the default one.

The most basic index.html must include three functions: `factor_html_attr()`, `factor_head()`, and `factor_body_attr()`. These functions are what plugins use if they need to add information to your head, etc.

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

  <body {{{ factor_body_attr() }}}>
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

The `factor-styles.css` file (`.less` and `.scss` also supported) is the recommended way of adding your CSS and CSS variables. They are parsed and loaded in the ideal order for overriding values (_app > theme > plugin_).

More info about this file under [customize](./customize).

## The "static" folder

Anything you add to the static folder will be moved to the `dist` folder directly during build and then served from there directly. For example, if you add the file `screenshot.png` to this folder, it will be available at `https://yoursite.com/screenshot.png` when you are serving your app.

Recommended files for your static folder include:

- **Favicon.png** - Square 100pxx100px - A standard and portable icon for your app. Used in browser tabs and elsewhere.
- **Icon.png** - Square 300pxx300px - Your apps standard icon, used by plugins and themes to add your branding.

## Essential Components: Site, Content, 404

Factor apps require some special components that are used to control behavior of your app. These include:

- **Site.vue** - This is the master wrapper component for your app in both your dashboard and front-end. It is possible to override this file but should be considered advanced to do so.
- **Content.vue** - This is the wrapper for the pages on the front-end of your site. Overriding this file can make it easy to customize footer and page layout.
- **404.vue** - The fallback component if no route is setup for a URL someone visits.

To override any of these, all you need to do is add a component with the same name to your `src` folder.

## Built Folders: dist and .factor

When you build your app, Factor generates two folders.

- **Dist**- THis is the production build of your application. In other words, it is what is served when you host your app.
- **.factor** - This folder contains your module loaders and is generated whenever you run a Factor build.
