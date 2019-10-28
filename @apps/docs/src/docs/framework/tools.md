## Framework Overview

Factor is a modular Javascript framework powered by many different tools:

- **Framework**
  - [Vue](https://vuejs.org/)
  - [Vue SSR](https://ssr.vuejs.org/)
  - [Vue Router](https://router.vuejs.org/)
  - [Vuex Stores](https://vuex.vuejs.org/)
- **App Management**
  - [Webpack](https://webpack.js.org/)
- **Server**
  - [NodeJS/Express](https://expressjs.com/)
- **CLI**
  - [Yarn](https://yarnpkg.com/en/)
  - [Inquirer](https://github.com/SBoudrias/Inquirer.js/)
  - [Commander](https://github.com/tj/commander.js/)

These are the major foundational components of the framework and you may find it helpful to read their documentation.

## Scope

Combining all the above tools into a working application is difficult. If you've tried it, you might have found that things get complicated and messy fast. After a similar experience, we decided to create Factor to save you this pain!

Factor is designed to be:

- Modular
- Well Organized
- Minimal
- Extension First

And Factor is designed to help you:

- Deploy production applications as fast as possible
- Minimize your time "reinventing the wheel"
- Use best practices

### Factor's Key Tools

Factor is driven by a few "key" utilities:

- [Filters](/guide/filters) - Allows for modularity and extension
- [CLI](/guide/cli) - Manages your development workflow
- [Config](/guide/config) - Coordinates your configuration management

## Extensions

Factor is an "extension first" framework. It's built so that you can do _anything_ you want with an extension.

[Learn About Extending Factor](/guide/extending-factor)

## VueJS & Node

VueJS and Node/Express are Factor's Javascript engine. If you're familiar with these tools, then you likely know a LOT about how to use Factor. There are a few caveats and improvements however. These we will discuss below.

If you're not familiar with the basics of creating Vue components and routes, you can read more about them on [Vue's documentation portal](https://vuejs.org/).

## Server-Side-Rendering (SSR)

Factor apps are server-rendered. This means that a working Factor app, will have its source generated on a server and sent to users browsers as raw source. This has many critical advantages that most modern web apps need, for example:

- Improved SEO - Since search-engines prefer to source information from raw source
- Improved Syndication - Social and sharing apps scrape your source to get meta information when users post about your app

The SSR engine is based on Vue's [server-rendering system](https://ssr.vuejs.org).

In many ways, Factor behaves like a typical Vue app but SSR leads to some important caveats (which are the same for all Vue SSR apps)

[Read More About SSR](/guide/server-side-rendering)

## Utilities

Factor also includes a few useful JS utilities:

- [Axios](https://github.com/axios/axios)
- [Markdown It](https://github.com/markdown-it/markdown-it)

You can access them as follows:

```javascript
Factor.$http // axios
Factor.$markdown.util() // markdown-it
```
