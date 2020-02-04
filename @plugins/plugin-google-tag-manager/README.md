# Overview

This is a simple plugin that adds [Google Tag Manager](https://tagmanager.google.com) to your `index.html` using the `factor_head` and `factor_body_start` filters.

## Installation

Just add to your application dependencies:

```bash
npm add  @factor/plugin-google-tag-manager
```

## Options and Settings

Config for this plugin is public only and stored in your `factor-settings.js` file.

```jsonc
// factor-settings.js
{
  "googleTagManager": {
    "googleTagManagerId": "SOMEID", // Your GTM Container ID
    "developmentMode": true // Load GTM in "development" mode
  }
}
```

## Factor Setup CLI

Run `npx factor setup` for a question based CLI to help you configure this plugin's options.
