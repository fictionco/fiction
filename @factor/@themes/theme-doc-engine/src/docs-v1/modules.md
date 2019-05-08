# Modules

> Modules are Factor.js extensions which can extend its core functionality and add endless integrations.

## Introduction

While developing production-grade applications with Factor, you'll soon discover that the framework's core
functionality is not enough. Factor can be extended with configuration options and plugins,
but maintaining these customizations across multiple projects is tedious, repetitive and time-consuming.
On the other hand, supporting every project's needs out of the box would make Factor very complex and hard to use.

This is one of the reasons why Factor provides a higher-order module system that makes it easy to extend the core.
Modules are simply **functions** that are called sequentially when booting Factor.
The framework waits for each module to finish before continuing.
In this way, modules can customize almost any aspect of Factor.
Thanks to Factor's modular design (based on webpack's [Tapable](https://github.com/webpack/tapable)),
modules can easily register hooks for certain entry points like the builder initialization.
Modules can also override templates, configure webpack loaders, add CSS libraries, and perform many other useful tasks.

Best of all, Factor modules can be incorporated into npm packages.
This makes them easy to reuse across projects and to share with the Factor community,
helping create an ecosystem of high-quality Factor add-ons.

Modules are great if you:

- Are a member of an **agile team** that needs to quickly bootstrap new projects.
- Are tired of **re-inventing** the wheel for common tasks like integrating Google Analytics.
- Are a lovely **Open Source** enthusiast who would like to easily **share** your work with the community.
- Are a member of an **enterprise** company that values **quality** and **reusability**.
- Are often up against short deadlines and don't have time to dig into the details of every new library or integration.
- Are tired of dealing with breaking changes to low-level interfaces, and need things that **just work™**.

## List of Factor.js modules

The Factor.js team offers **official** modules:
- [@factor/http](https://http.factorjs.org): Light and universal way to make HTTP requests, based on [ky-universal](https://github.com/sindresorhus/ky-universal)
- [@factorjs/axios](https://axios.factorjs.org): Secure and Easy Axios integration with Factor.js to make HTTP requests
- [@factorjs/pwa](https://pwa.factorjs.org): Supercharge Factor with a heavily tested, updated and stable PWA solution
- [@factorjs/auth](https://auth.factorjs.org): Authentication module for Factor.js, offering different schemes and strategies

A list of Factor.js modules made by the community is available on https://github.com/topics/factor-module

## Write a basic Module

As already mentioned modules are just simple functions. They can be packaged as npm modules or directly included in project source code.

**modules/simple.js**

```js
export default function SimpleModule (moduleOptions) {
  // Write your code here
}

// REQUIRED if publishing the module as npm package
// module.exports.meta = require('./package.json')
```

**`moduleOptions`**

This is the object passed using `modules` array by user we can use it to customize it's behavior.

**`this.options`**

You can directly access Factor options using this reference. This is the content of the user's `factor.config.js` with all default options assigned to. It can be used for shared options between modules.

**`this.factor`**

This is a reference to current Factor instance. Refer to [Factor class docs for available methods](/api/internals-factor).

**`this`**

Context of modules. Please look into the [ModuleContainer](/api/internals-module-container) class docs for available methods.

**`module.exports.meta`**

This line is **required** if you are publishing module as an npm package. Factor internally uses meta to work better with your package.

**factor.config.js**

```js
export default {
  modules: [
    // Simple usage
    '~/modules/simple'

    // Passing options directly
    ['~/modules/simple', { token: '123' }]
  ]
}
```

We then tell Factor to load some specific modules for a project with optional parameters as options.
Please refer to [modules configuration](/api/configuration-modules) docs for more info!

## Async Modules

Not all modules will do everything synchronous. For example you may want to develop a module which needs fetching some API or doing async IO. For this, Factor supports async modules which can return a Promise or call a callback.

### Use async/await

<div class="alert">

Be aware that `async`/`await` is only supported in Node.js > 7.2. So if you are a module developer at least warn users about that if using them. For heavily async modules or better legacy support you can use either a bundler to transform it for older Node.js compatibility or a promise method.

</div>

```js
import fse from 'fs-extra'

export default async function asyncModule() {
  // You can do async works here using `async`/`await`
  let pages = await fse.readJson('./pages.json')
}
```

### Return a Promise

```js
import axios from 'axios'

export default function asyncModule() {
  return axios.get('https://jsonplaceholder.typicode.com/users')
    .then(res => res.data.map(user => '/users/' + user.username))
    .then(routes => {
      // Do something by extending Factor routes
    })
}
```

## Common Snippets

### Top level options

Sometimes it is more convenient if we can use top level options while registering modules in `factor.config.js`.
This allows us to combine multiple option sources.

**factor.config.js**

```js
export default {
  modules: [
    ['@factorjs/axios', { anotherOption: true }]
  ],

  // axios module is aware of this by using `this.options.axios`
  axios: {
    option1,
    option2
  }
}
```

**module.js**

```js
export default function (moduleOptions) {
  // `options` will contain option1, option2 and anotherOption
  const options = Object.assign({}, this.options.axios, moduleOptions)

  // ...
}
```

### Provide plugins

It is common that modules provide one or more plugins when added.
For example [bootstrap-vue](https://bootstrap-vue.js.org) module would require to register itself into Vue.
In such situations we can use the `this.addPlugin` helper.

**plugin.js**

```js
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'

Vue.use(BootstrapVue)
```

**module.js**

```js
import path from 'path'

export default function factorBootstrapVue (moduleOptions) {
  // Register `plugin.js` template
  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}
```

### Template plugins

Registered templates and plugins can leverage [lodash templates](https://lodash.com/docs/4.17.4#template) to conditionally change registered plugins output.

**plugin.js**

```js
// Set Google Analytics UA
ga('create', '<%= options.ua %>', 'auto')

<% if (options.debug) { %>
// Dev only code
<% } %>
```

**module.js**

```js
import path from 'path'

export default function factorBootstrapVue (moduleOptions) {
  // Register `plugin.js` template
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      // Factor will replace `options.ua` with `123` when copying plugin to project
      ua: 123,

      // conditional parts with dev will be stripped from plugin code on production builds
      debug: this.options.dev
    }
  })
}
```

### Add a CSS library

If your module will provide a CSS library, make sure to perform a check if the user already included the library to avoid duplicates, and add **an option to disable** the CSS library in the module.

**module.js**

```js
export default function (moduleOptions) {
  if (moduleOptions.fontAwesome !== false) {
    // Add Font Awesome
    this.options.css.push('font-awesome/css/font-awesome.css')
  }
}
```

### Emit assets

<!-- todo: up2date? -->

We can register webpack plugins to emit assets during build.

**module.js**

```js
export default function (moduleOptions) {
  const info = 'Built by awesome module - 1.3 alpha on ' + Date.now()

  this.options.build.plugins.push({
    apply (compiler) {
      compiler.plugin('emit', (compilation, cb) => {

        // This will generate `.factor/dist/info.txt' with contents of info variable.
        // Source can be buffer too
        compilation.assets['info.txt'] = { source: () => info, size: () => info.length }

        cb()
      })
    }
  })
}
```

### Register custom webpack loaders

We can do the same as `build.extend` in `factor.config.js` using `this.extendBuild`.

**module.js**

```js
export default function (moduleOptions) {
    this.extendBuild((config, { isClient, isServer }) => {
      // `.foo` Loader
      config.module.rules.push({
        test: /\.foo$/,
        use: [...]
      })

      // Customize existing loaders
      // Refer to source code for Factor internals:
      // https://github.com/factor/factor.js/tree/dev/packages/builder/src/webpack/base.js
      const barLoader = config.module.rules.find(rule => rule.loader === 'bar-loader')
  })
}
```

## Run Tasks on Specific hooks

Your module may need to do things only on specific conditions and not just during Factor initialization.
We can use the powerful [Hookable](https://github.com/factor/factor.js/blob/dev/packages/core/src/hookable.js) Factor.js system to do tasks on specific events.
Factor will wait for your function if it return a Promise or is defined as `async`.

Here are some basic examples:

```js
export default function myModule() {

  this.factor.hook('modules:done', moduleContainer => {
    // This will be called when all modules finished loading
  })

  this.factor.hook('render:before', renderer => {
    // Called after the renderer was created
  })

  this.factor.hook('build:compile', async ({name, compiler }) => {
    // Called before the compiler (default: webpack) starts
  })

  this.factor.hook('generate:before', async generator => {
    // This will be called before Factor generates your pages
  })
}
```

## Module package commands

**Experimental**

Starting in `v2.4.0`, you can add custom factor commands through a Factor module's package. To do so, you must follow the `FactorCommand` API when defining your command. A simple example hypothetically placed in `my-module/bin/command.js` looks like this:

```js
#!/usr/bin/env node

const consola = require('consola')
const { FactorCommand } = require('@factor/cli')

FactorCommand.run({
  name: 'command',
  description: 'My Module Command',
  usage: 'command <foobar>',
  options: {
    foobar: {
      alias: 'fb',
      type: 'string',
      description: 'Simple test string'
    }
  },
  run(cmd) {
    consola.info(cmd.argv)
  }
})
```

A few things of note here. First, notice the call to `/usr/bin/env` to retrieve the Node executable. Also notice that ES module syntax can't be used for commands unless you manually incorporate [`esm`](https://github.com/standard-things/esm) into your code.

Next, you'll notice how `FactorCommand.run()` is used to specify the settings and behavior of the command. Options are defined in `options`, which get parsed via [`minimist`](https://github.com/substack/minimist).
Once arguments are parsed, `run()` is automatically called with the `FactorCommand` instance as first parameter.

In the example above, `cmd.argv` is used to retrieve parsed command-line arguments. There are more methods and properties in `FactorCommand` -- documentation on them will be provided as this feature is further tested and improved.

To make your command recognizable by the Factor CLI, list it under the `bin` section of your package.json, using the `factor-module` convention, where `module` relates to your package's name. With this central binary, you can use `argv` to further parse more `subcommands` for your command if you desire.

```js
{
  "bin": {
    "factor-foobar": "./bin/command.js"
  }
}
```

Once your package is installed (via NPM or Yarn), you'll be able to execute `factor foobar ...` on the command-line.

<div class="alert">

There are way more hooks and possibilities for modules. Please read the [Factor Internals](/api/internals) to find out more about the factor-internal API.

</div>