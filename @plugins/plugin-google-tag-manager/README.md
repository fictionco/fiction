# Overview

This [Factor](https://factor.dev) Plugin adds [Google Tag Manager](https://tagmanager.google.com) to your app. Use this to add marketing plugins and most importantly, analytics.

## Installation

Just add to your application dependencies:

```bash
npm add  @factor/plugin-google-tag-manager
```

## Customization and Settings

Config for this plugin is public only and stored in your `factor-settings.js` file.

```jsonc
// factor-settings.js
{
  "googleTagManager": {
    "googleTagManagerId": "GTM-XXXXXXX", // Your GTM Container ID
    "developmentMode": true // Load Tags in "development" mode (npm factor dev)
  }
}
```

## Using The Tag Manager Plugin

Once you've added your tag manager ID, this plugin will load the tag manager on your Factor app. From that point, most/all customization should happen inside the Google Tag Manager interface.

### A Note on Tracking Route Changes

For any plugins that rely on pages to trigger an event, you'll need to add a trigger on "history change" event in the manager. This is because Factor only refreshes pages direct browser loads (for performance).

It is especially important to add this for Google Analytics to appropriately track page views and user journeys through your site.

A screenshot for how analytics should be configured:

![GA History Change](https://i.imgur.com/OzkNgrQ.png)
