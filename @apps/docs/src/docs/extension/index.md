# Extending Factor 

*Factor is an "extension-first" framework; meaning, it's designed to be extended. This article discusses the types of extensions available and how to create them.*

## Types of Extensions

Factor supports three extension types: plugins, themes and stacks.

### Plugins

Plugins deliver new features or functionality to Factor. For example, adding an SEO utility or bug-tracking middleware.

### Themes

Themes give you a design framework and include UI for commonly used items like notifications or buttons. The sky is the limit as far as what themes can do: 
- Simple themes can simply include Factor plugins and/or integrate popular UI frameworks in the Factor format. 
- Advanced themes can create option frameworks, add drag-and-drop page builders, etc...

### Stacks

Stacks help abstract services and APIs into a modular format. By keeping services code in a module, stacks help you:
- avoid lock-in with vendors which may prove less than ideal
- avoid learning and debugging proprietary APIs and libraries
- speeds up time integrating services 

## Adding Extensions

Adding extensions is easy. All you have to do is list a Factor extension, which is a Node module, as a dependency to your app. 

Factor traces down your dependency tree to find all the modules that demark themselves as Factor extensions.

```bash
$ yarn add @factor/some-core-factor-plugin

# or

$ yarn add some-third-party-factor-plugin
```

## Creating an Extension

### Modules

Factor extensions are just standard node modules that integrate and work with core Factor tools like [$filters](/guide/filters). So creating a Factor module starts with simply creating a new NPM module.

Once you have your module created, it should include a `package.json` file. In that file, Factor plugins use the `factor` property to add information about how Factor plugins should be loaded and included. 

### Defining a Plugin

Setting the property `factor` tells Factor that it is seeing a Factor plugin and to treat it accordingly. All Factor plugins should set this property: 
```json
// package.json
{
  "factor": {}
}
```

#### Autoload Your Extension

Field: **target** 

The "target" option tells Factor if it should "autoload" the extension if it's listed as a dependency. Autoloading can really help user experience as your extension can "just work" and often times it can seem like magic to your users.

> **About:**
> Factor works between two primary target environments, the webpack-generated "app" and the Express/Node "server". It's important to note that many modules that work fine in Node, will throw errors if used with a webpack driven app. Therefore, this option helps you control how extensions are loaded.

If target is set to "app" then the plugin will be autoloaded in both the server environment and the Vue app environments.

#### The Type of Extension

Field: **extend** 

The "extend" property just tells Factor what type of extension you're adding: plugin, theme, or stack. This helps Factor identify the purpose and scope of the extension.

#### Reference the Extension

Field: **id** 

The "id" property makes it so you can reference the returned module elsewhere in your app. If you include an id of "apple", you'll be able to access the module in your app as `Factor.$apple`.

### Example

```json
// package.json
{
  "name": "my-factor-module",
  "description": "...",

  // Setting the 'factor' property is required for the module to be treated as a Factor plugin
  "factor": {

    // EXTENSION ID
    "id": "myFactorModule", // Can reference via Factor.$myFactorModule

    // AUTOLOAD TARGET
    // default: If empty or undefined, no autoloading will take place
    "target": "app", // Loads in both express server and webpack app
    // or
    "target": "server", // Loads only in express server
    // or
    "target": {
      "app": "", // Loads index.js (default) in webpack app
      "server": "server" // Loads server.js on Express server
    }, 

  
    // EXTENSION TYPE
    // Default: If empty or undefined, defaults to "plugin"
    "extend": "theme",  // Treats as a theme extension
    // or 
    "extend": "stack" // Treats as a stack extension

    
  }
}
```

## Module Format

Factor extension files follow a specific JS class format, designed to allow for maximum convenience and flexibility when working. In a nutshell, extension entry files take a single `Factor` argument (which includes references to most critical Factor utilities) and return a class. 

As an example, if you set up an extension file like this:

```javascript
// index.js
export default Factor => {
  return new class{
    constructor(){
      // Initialization and Filters
    }

    async sendEmail(email){
      // Send email code

    }

    // other methods...
  }()
}

```

And apply some basic setup in package.json like this;
```json
// package.json
"factor": {
    "id": "myEmailPlugin", 
    "target": "app"
}
```

In your app, you'll be able to reference and use the extension like this: 

```javascript
// Some component
async myComponentMethod(){
  await Factor.$myEmailPlugin.sendEmail() // send an email or something
}

```

