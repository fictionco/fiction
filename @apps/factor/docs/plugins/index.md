## Overview: Zero-Config Plugins

Factor is built for extensibility. It allows you to easily add plugins that are meant to add or alter the default functionality of the system. Here we'll cover the basics of installing and using plugins, along with documentation on how to create your own.

Unlike other JS frameworks, Factor is designed for zero-config extensibility. In other words, with just one command: `npm add @factor/my-plugin` a plugin will be installed and configured, and you should see it working on your app.

Plugins do this using Factor's hooks and filters system, which allows plugins to "hook into" different parts of the overall system. After

### Finding Factor Plugins

Factor plugins are just NPM modules that are added as dependencies in projects, stacks or themes. Factor identifies this by scanning your modules for the `factor` keyword in the module name. To find new plugins, we've created a [listing of Factor extensions](https://factor.fiction.com/extend) for you.

### Installing A Plugin

To install a plugin, you just need to add it to your project dependencies. The easiest way to do this is with the Yarn (or NPM) utility. For example, to add the blog plugin just run:

- `npm add @factor/plugin-blog`

**Settings**
Once installed, most plugins will work with little additional config. However, many plugins may provide additional settings to make customization easier.

To see this, run the command `npx factor setup` and you may see an additional set of options related to your plugin.
