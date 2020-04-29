---
title: Webpack and Builds
description: Learn how to extend Webpack production and development builds
---

# Extending Webpack 

Webpack is used to build your app into a format that the client can understand. Learn how to extend and add new functionality to your Webpack build.

> All Webpack customization uses [Filters](./../filters-callbacks-events), make sure to run them in the `server` context.

## Plugins 

To add additional [Webpack plugins](https://webpack.js.org/plugins/) use the `webpack-plugins` filter.

```js
import {addFilter} from "@factor/api" 
import BundleAnalyzer from "webpack-bundle-analyzer"

addFilter({
  hook: "webpack-plugins", 
  key: "exampleKey", 
  callback: (plugins, _arguments) => {

    // Add if is for the server build
    if(_arguments.target == 'server'){
      plugins.push(new BundleAnalyzer.BundleAnalyzerPlugin())
    }
    
    return plugins
  }
})
```

## Define Cross Environment Variables 

The app and server environments don't share a context so it's necessary to use [Webpack define plugin](https://webpack.js.org/plugins/define-plugin/) in order to share variables. To do so use the `webpack-define` filter. 

The only caveat to this plugin is that you have to wrap everything in quotes including strings (double wrap strings). This is because they are written to files and unwrapped on build. 

```js
import {addFilter} from "@factor/api" 

addFilter({
  hook: "webpack-define", 
  key: "exampleKey", 
  callback: vars => {

    const var = "example" 
    vars["process.env.MY_VARIABLE"] = JSON.stringify(var) // stringify to wrap twice

    return vars
  }
})
```

## Aliases

To add Webpack module aliases use the `webpack-aliases` filter. 

```js
import {addFilter} from "@factor/api" 

addFilter({
  hook: "webpack-define", 
  key: "exampleKey", 
  callback: vars => {

    const var = "example" 
    vars.__MY_ALIAS__ = "/my-path/to/alias"

    return vars
  }
})
```

## Loaders 

To add or adjust [Webpack Loaders](https://webpack.js.org/loaders/) use the `webpack-loaders` filter: 

```js
import {addFilter} from "@factor/api" 

addFilter({
  hook: "webpack-loaders", 
  key: "exampleKey", 
  callback: loaders => {

    loaders.push({ test: /\.scss$/, loader: "sass-loader" })

    return loaders
  }
})
```

## Copy Files to Distribution Build 

When the application builds, in advanced cases you might want to copy files from you app into the distribution folder directly. For, this use the `webpack-copy-files-config` filter. This filter follows into the [WebpackCopyPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/) plugin. 

The format for entries is `{ from: 'source', to: 'dest' }`

```js
import {addFilter} from "@factor/api" 

addFilter({
  hook: "webpack-copy-files-config", 
  key: "exampleKey", 
  callback: copyItems => {

    const var = { from: 'source', to: 'dest' }
    copyItems.push(var)

    return copyItems
  }
})
```

## General Config 

Finally, you can make edits to the entire Webpack configuration using the `webpack-config` filter along with the arguments used to generate it. 

```js
import {addFilter} from "@factor/api" 

addFilter({
  hook: "webpack-config", 
  key: "exampleKey", 
  callback: (config, _arguments) => {

    // do something with config 

    return config
  }
})
```
