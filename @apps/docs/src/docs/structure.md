# App File Structure

## Setting Up An App

The easiest way to set up a Factor app is to start with an example app or use the helpful `create-factor-app` utility. This way you'll be sure to have the proper config and filenames, etc..

However, it is also easy and helpful to understand the function of each file and the ways that an app can be customized. This doc will discuss the basic Factor module structure along with the purpose and proper use of the different files you'll encounter.

## Standard Files

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

### The Main File: index.js

Index.js is the main entry file for Factor apps and modules. The main file is generally the best place to add customizations via filters, custom routes and any other custom code your app will need.

### Source vs Root Folder

In a Factor app, the source or `src` folder is determined by the folder containing your primary `main` file of your app. If, for example, your app package.json sets main to `src/index.js` then the folder `src` will be treated as your app source.

Here is how you should think of the two key folders of your app:

- **Source** - (`/src`) - This is your application source code. It should include all components, images, static files, templates, etc..
- **Root** - (`/`) - The root of your app should be used for configuration (factor-config, .env, package.json), build and test code, etc..

### Class Export Convention

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

## Template: index.html

Your index.html template is the skeleton for every page on your app. It can be overridden, but it has a rich "hook" system that allows you to accomplish almost anything with either [Vue Meta](https://github.com/nuxt/vue-meta) or any of several direct Factor hook functions.

Learn more about setting meta on the [meta guide](./meta).

The default index.html file looks like this:

```html
<!-- The default index.html file -->
<!DOCTYPE html>
<html {{{ factor_html_attr() }}}>
  <head {{{ factor_head_attr() }}}>
    {{{ factor_head() }}}
  </head>

  <body {{{ factor_body_attr() }}}>
    {{{ factor_body_start() }}}
    <!--vue-ssr-outlet-->
    {{{ factor_body_end() }}}
  </body>
</html>
```

## Config Files

### factor-config.json

The `factor-config` file is used to add public config to your project. It is a writeable file used by plugins and the `factor setup` CLI command.

More information about this file can be found under [config](./config).

### .env

The `.env` file is a standard file based on the [Dotenv](https://github.com/motdotla/dotenv) module.

More information about this file can be found under [config](./config).

## Customization Files

### factor-settings.js

The `factor-settings` file is where apps, plugins, and themes add settings that can be accessed via `Factor.$setting.get('some.setting')`. It is powerful and supports all everything from nav item arrays, to components, etc.

More info about this file under [customize](./customize).

### factor-styles.css

The `factor-styles.css` file _(`.less` and `.scss` also supported)_ is the recommended way of adding your CSS and CSS variables. They are parsed and loaded in the ideal order for overriding values (_app > theme > plugin_).

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

- **Dist**- The production build of your application. In other words, it is what is served when you host your app.
- **.factor** - This folder contains your module loaders and is generated whenever you run a Factor build.
