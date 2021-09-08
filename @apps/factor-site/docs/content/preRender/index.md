---
title: Pre-Rendering Your App
description: Pre-render your application and run it statically
---

For most use cases, pre-rendering your application and serving it statically is the optimal choice for running in production. This approach has the following advantages:

- **Scalability** - No server needed, static hosting is free (or cheap) even at scale
- **Portability** - What runs locally is what will run on your server. No differences between environments.

## Pre-Render Command

To prerender your application, all that is needed is to run the `factor prerender` CLI command.

```bash
npx factor prerender
```

Running this command will build all your application files&mdash;HTML, JS, CSS, etc...&mdash;and place them in a distribution folder for serving.

## Serving After Pre-Render

If you'd like to serve your application somewhere directly after you've built it, add the `--serve` option:

```bash
npx factor prerender --serve
```

You can control which port the application is served at using the `--app-port` option in the command.

## Endpoint Server

If you'd like to have server-oriented functionality but still host your application statically&mdash;i.e. JamStack&mdash; then you'll want to set up an "endpoint" server in production.

For a guide on deploying your endpoint server, check out the [server docs](./server).

Once you've deployed, you'll have a base URL where your server is hosted and ready to respond to endpoint requests. To let your pre-rendered site know where the endpoint server is located, you'll need to add the `FACTOR_SERVER_URL` environmental variable.

```bash
#dotenv
FACTOR_SERVER_URL='https://server.factor.so'
```
