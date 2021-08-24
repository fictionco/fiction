---
title: Basic App Configuration
description: The basic configuration information needed in a Factor app
---

To get Factor to work seamlessly, make sure you have the basic configuration items set up.

## Factor Config

Factor uses the `factor` property inside of `package.json` as the location for your app's basic public configuration.

For minimal configuration, we recommend adding your app's meta information, your initial admin users, and your main file loading config.

### App Meta Information

For your application, we need to know:

- App name
- App description (for meta information - optional)
- App email address (for transactional emails)
- App URL in production

```json
// package.json
{
  "factor": {
    "app": {
      "name": "Example App",
      "url": "https://example.com",
      "description": "An app that discusses examples.",
      "email": "Example Team <example@example.com>"
    }
  }
}
```

## Endpoint Server Config

## Application Config

## Dotenv and Environmental Variables
