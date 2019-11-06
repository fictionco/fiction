# Overview

This is a simple plugin that adds [Google Tag Manager](https://tagmanager.google.com) to your `index.html` using the `factor_head` and `factor_body_start` filters.

## Installation

Just add to your application dependencies:

```bash
yarn add @factor/plugin-google-tag-manager
```

## Options and Settings

Config for this plugin is public only and stored in your `factor-config.json` file.

```jsonc
// factor-config.json
{
  "google_tag_manager": {
    "gtm_id": "SOMEID", // Your GTM Container ID
    "development_mode": true // Load GTM in "development" mode
  }
}
```

## Factor Setup CLI

Run `yarn factor setup` for a question based CLI to help you configure this plugin's options.
