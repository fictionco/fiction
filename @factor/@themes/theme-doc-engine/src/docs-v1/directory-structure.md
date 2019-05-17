# Directory Structure

#### [File and Directory Structure](#structure)

The basic file and directory for typical Factor apps and themes looks like this: 

```yaml

# Config
--: package.json
--: factor-config.json (optional for now)
--: factor-secrets.json (optional for now)

# App Source
--/src: 
  --: plugin.js (app entry file)
  --: index.html (HTML template wrapper for all pages)
  --: content.vue (component wrapper for all views)
  --: fallback.vue  (404 error)
  --: ...(additional components and folders)...
--/static:
  --: static assets (favicon, manifest)

# Other 
--: .gitignore (make sure to ignore factor-secrets.json)
```



> The default Factor.js application structure is intended to provide a great starting point for both large and small applications. Of course, you are free to organize your application however you like.

## Directories

### [The SRC Directory](#the-src-directory)

The `src` directory contains your un-compiled pages, images, or components.

[More documentation about SRC integration](/docs/src)

### [The Components Directory](#the-components-directory)

The `components` directory contains your Vue.js Components. You can't use either `asyncData` or `fetch` in these components.

### [The Layouts Directory](#the-layouts-directory)

The `layouts` directory includes your application layouts. Layouts are used to change the look and feel of your page (for example by including a sidebar).

[More documentation about Layouts integration](/docs/views#layouts)

_This directory cannot be renamed without extra configuration._

### [The Middleware Directory](#the-middleware-directory)

The `middleware` directory contains your Application Middleware. Middleware lets you define custom functions that can be run before rendering either a page or a group of pages (layouts).

[More documentation about Middleware integration](/docs/routing#middleware)

### [The Pages Directory](#the-pages-directory)

The `pages` directory contains your Application Views and Routes. The framework reads all the `.vue` files inside this directory and creates the application router.

_This directory cannot be renamed without extra configuration._

[More documentation about Pages integration](/docs/views)

### [The Plugins Directory](#the-plugins-directory)

The `plugins` directory contains your Javascript plugins that you want to run before instantiating the root Vue.js Application. This is the place to register components globally and to inject functions or constants.

[More documentation about Plugins integration](/docs/plugins)

### [The Static Directory](#the-static-directory)

The `static` directory is directly mapped to the server root (`/static/robots.txt` is accessible under `http://localhost:3000/robots.txt`) and contains files that likely won't be changed (i.e. the favicon)

**Example:** `/static/robots.txt` is mapped as `/robots.txt`

_This directory cannot be renamed without extra configuration._

[More documentation about Static integration](/docs/assets#static)

### [The Store Directory](#the-store-directory)

The `store` directory contains your [Vuex Store](http://vuex.vuejs.org/en/) files. The Vuex Store comes with Factor.js out of the box but is disabled by default. Creating an `index.js` file in this directory enables the store.

_This directory cannot be renamed without extra configuration._

[More documentation about Store integration](/docs/vuex-store)

### [The factor-config.json File](#the-factor-configjson-file)

The `factor-config.json` file contains your Factor.js custom configuration.

_This file cannot be renamed without extra configuration._

[More documentation about `factor-config.json` integration](/docs/configuration)

### [The package.json File](#the-packagejson-file)

The `package.json` file contains your Application dependencies and scripts.

_This file can not be renamed._

## Aliases

| Alias | Directory |
|-----|------|
| `~` or `@` | [srcDir](/api/configuration-srcdir) |
| `~~` or `@@` | [rootDir](/api/configuration-rootdir) |

By default, `srcDir` is the same as `rootDir`.

<div class="alert">
  
  **Info:** Inside your `vue` templates, if you need to link to your `assets` or `static` directory, use `~/assets/your_image.png` and `~/static/your_image.png`.

</div>