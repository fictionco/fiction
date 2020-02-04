# Factor Bugsnag Plugin

## Overview

This plugin implements Bugsnag in your Factor app which helps you stay informed about errors encountered by users.

## Before you start

- You'll need a [Bugsnag](https://www.bugsnag.com) account and a notifier API key.

## Installation

```bash
npm add  @factor/plugin-bugsnag
```

## Usage

All that you need to do to get this plugin working is add `bugsnag.clientApiKey` to your `factor-settings.js` file.

You can easily add and edit this information using the native Factor setup CLI. Run the setup CLI using the command `npx factor setup` once you've installed the plugin (set as a dependency).
