---
title: Dev Server
description: Learn how to use Factor development tools
---

To run Factor's development server, you'll need to use the `dev` command. There are a few things to be aware of.

## How Development Mode Works

Once you've [set up your basic application](./quickstart) the next step is to run your development server.

The development server does the following:

- Runs your application server and endpoint server, defaulting to port `3000` and port `3210` respectively
- Watches for changes to files and handles HMR or server restart (if file name includes the word `server`)

Aside from these differences, the rest will largely work the same as when you run Factor in production.

## Running Dev Mode

To run the development server, just use the Factor CLI `dev` command:

```bash
npx factor dev
```

## Dev Options

There are a few available development CLI options:

- `--inspect` - Run Factor with the [Node inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/) enabled. This allows you to use your browser development tools to debug and work with Node.
- `--app-port` - Port for the application server
- `--app-server` - Port for the endpoint server
