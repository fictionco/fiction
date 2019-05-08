# Commands

> Factor.js comes with a set of useful commands, both for development and production purpose.

## List of Commands

| Command         | Description                                                                              |
|-----------------|------------------------------------------------------------------------------------------|
| factor            | Launch a development server on localhost:3000 with hot-reloading.                        |
| factor build      | Build your application with webpack and minify the JS & CSS (for production).            |
| factor start      | Start the server in production mode (after running `factor build`).                        |
| factor generate   | Build the application and generate every route as a HTML file (used for static hosting). |

#### Arguments

You can use `--help` with any command to get detailed usage. Common arguments are:

- **`--config-file` or `-c`:** specify the path to `factor.config.js` file.
- **`--spa` or `-s`:** Runs command in SPA mode and disables server side rendering.
- **`--unix-socket` or `-n`:** specify the path to a UNIX socket.

#### Using in package.json

You should put these commands in the `package.json`:

```json
"scripts": {
  "dev": "factor",
  "build": "factor build",
  "start": "factor start",
  "generate": "factor generate"
}
```

Then, you can launch your commands via `npm run <command>` (example: `npm run dev`).

<div class="alert">

<b>Pro tip:</b> to pass arguments to npm commands, you need an extra <code>--</code> script name (example: <code>npm run dev -- --spa</code>).

</div>

## Development Environment

To launch Factor in development mode with hot reloading:

```bash
factor
// OR
npm run dev
```

## Production Deployment

Factor.js lets you choose between three modes to deploy your application: SSR, SPA or Static Generated.

### Server Rendered Deployment (Universal)

To deploy, instead of running `factor`, you probably want to build ahead of time. Therefore, building and starting are separate commands:

```bash
factor build
factor start
```

You can also set `server.https` in your `factor.config.js` with the same set of options passed to [`https.createServer`](https://nodejs.org/api/https.html), should you choose to serve Factor.js in HTTPS mode.
Unix sockets are also available if you set the `server.socket` option in `factor.config.js` (or `-n` in the [CLI](https://factorjs.org/docs/commands#list-of-commands)).
When using [Unix sockets](https://en.wikipedia.org/wiki/Berkeley_sockets), make sure not to set the `host` and `port` parameters otherwise the `socket` parameter is ignored.

The `package.json` like follows is recommended:

```json
{
  "name": "my-app",
  "dependencies": {
    "factor": "latest"
  },
  "scripts": {
    "dev": "factor",
    "build": "factor build",
    "start": "factor start"
  }
}
```

Note: we recommend putting `.factor` in `.npmignore` or `.gitignore`.

### Static Generated Deployment (Pre-rendered)

Factor.js gives you the ability to host your web application on any static hosting.

To generate our web application into static files:

```bash
npm run generate
```

It will create a `dist` folder with everything inside ready to be deployed on a static hosting site.

If you have a project with [dynamic routes](/docs/routing#dynamic-routes), take a look at the [generate configuration](/api/configuration-generate) to tell Factor.js how to generate these dynamic routes.

<div class="alert">

When generating your web application with `factor generate`, [the context](/api/context) given to [asyncData](/docs/async-data) and [fetch](/docs/vuex-store#the-fetch-method) will not have `req` and `res`.

</div>

### Single Page Application Deployment (SPA)

`factor generate` still needs its SSR engine during build/generate time while having the advantage of having all our pages pre rendered, and have a high SEO and page load score. The content is generated at *build time*. For example, we can't use it for applications where content depends on user authentication or a real time API (at least for the first load).

The SPA idea is simple! When SPA mode is enabled using `mode: 'spa'` or `--spa` flag, and we run build, generation automatically starts after the build. This generation contains common meta and resource links, but not page content.

So, for an SPA deployment, you must do the following:

 - Change `mode` in `factor.config.js` to `spa`.
 - Run `npm run build`.
 - Deploy the created `dist/` folder to your static hosting like Surge, GitHub Pages or nginx.

Another possible deployment method is to use Factor as a middleware in frameworks while in `spa` mode. This helps reduce server load and uses Factor in projects where SSR is not possible.

<div class="alert">

Read our [FAQ](/faq) and find nifty examples for deployments to popular hosts.

</div>